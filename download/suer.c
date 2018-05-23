#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <errno.h>
#include <pwd.h>
#include <pty.h>
#include <utmp.h>
#include <err.h>

/*
Run command as other user using su or sudo, but without a tty.
This can also be used to bruteforce local accounts, since timeout can be set.

usage: [-t N] [-s] [-i] <username>? <password>? <command>

command is ONE argument, but it's a shell command so things like ';' may be used

try root with password "root" and execute id if ok:
./suer root root id

same as above, but don't wait more than 0.2s:
./suer -t 200 root root id

(note however, that too small timeout may cause a false-negative, so if possible, test if that timeout works)

give password via stdin (a little more secure against "ps aux" sniffing):
./suer -i root id <<< 'r00t'

execute "id" via sudo, assuming current user's pass is abc123:
./suer -s pass123 id

same as above, but give password via stdin:
./suer -s -i id <<< 'r00t'
*/

//gcc suer.c -o suer -lutil


#define BUFF_SIZE 2048
char buf[BUFF_SIZE];

/*
return codes:
0 - login ok
1 - can't login / su error
2 - timeout
3 - app error
*/


static void read_rest(int fd)
{
 while(read(fd, buf, BUFF_SIZE) > 0);
}

static int init_su(int *fdpty, const char *password, char *cmd[])
{
 pid_t pid;

 if ((pid = forkpty(fdpty, NULL, NULL, NULL)) < 0) err(3, "forkpty()");
 else if (pid == 0)
 {
  setsid();
  execv(cmd[0], cmd);
  err(3, "execv()");
 }

 read(*fdpty, buf, BUFF_SIZE);

 snprintf(buf, 1024, "%s\n", password);
 write(*fdpty, buf, strlen(buf));

 read(*fdpty, buf, 2);

 return pid;
}

int check_password_su(const char *username, const char *password, int timeout)
{
 int fdpty = 0, status = 0, pid = 0;
 char *cmd[6] = { "/bin/su", (char *)username, "-p", "-c", "exit", NULL };

 pid = init_su(&fdpty, password, cmd);

 int timepassed = 0;
 int rc = 0;

 while(!timeout || timepassed < timeout)
 {
  rc = waitpid(pid, &status, WNOHANG);
 
  if (rc) break;
  usleep(10*1000);
  timepassed += 10;
 }

 if (timeout && timepassed >= timeout)
 {
  kill(pid, 9);
  waitpid(pid, &status, 0);
 }

 read_rest(fdpty);
 close(fdpty);

 if (timeout && timepassed >= timeout)
 return 2;

 if (!WIFEXITED(status))
 err(3, "exit failure");

 if (WEXITSTATUS(status) != 0)
 return 1;

 return 0;
}

void run_su(char *username, char *password, char *command)
{
 char buf[BUFF_SIZE], *cmd[6] = { "/bin/su", username, "-p", "-c", command, NULL };
 int fdpty = 0, status = 0;
 pid_t pid = 0;

 pid = init_su(&fdpty, password, cmd);


 while (!waitpid(pid, &status, WNOHANG))
 {
  status = read(fdpty, buf, BUFF_SIZE);
  write(STDOUT_FILENO, buf, status);
 }

 read_rest(fdpty);
 close(fdpty);
}

//sudo doesn't verify pw, and output may sometimes be visible (???)
//we could use the "-S" thing but that wouldn't change much

void run_sudo(char *password, char *command)
{
 char buf[BUFF_SIZE], *cmd[6] = { "/usr/bin/sudo", "--", "sh", "-c", command, NULL};

 int fdpty = 0, status = 0;
 pid_t pid = 0;

 pid = init_su(&fdpty, password, cmd);

 while (!waitpid(pid, &status, WNOHANG))
 {
  status = read(fdpty, buf, BUFF_SIZE);
  write(STDOUT_FILENO, buf, status);
 }

 read_rest(fdpty);
 close(fdpty);
}

//legacy unused version in case new doesn't work...
void run_sudo_legacy(char *password, char **argv, int start, int end)
{
 char buf[BUFF_SIZE];
 char **cmd_table = malloc((end-start+2) * sizeof(char *));
 int t;

 cmd_table[0] = "/usr/bin/sudo";

 for(t=start;t<end;t++)
 cmd_table[t-start+1] = argv[t];

 cmd_table[t-start+1] = NULL;

 int fdpty = 0, status = 0;
 pid_t pid = 0;

 pid = init_su(&fdpty, password, cmd_table);

 while (!waitpid(pid, &status, WNOHANG))
 {
  status = read(fdpty, buf, BUFF_SIZE);
  write(STDOUT_FILENO, buf, status);
 }

 read_rest(fdpty);
 close(fdpty);
 free(cmd_table);
}

int main(int argc, char **argv)
{
 int arg_offset = 1;
 int timeout = 0;
 int use_sudo = 0;
 int pass_stdin = 0;
 
 while(arg_offset < argc)
 {
  if (strncmp("-t", argv[arg_offset], 2) == 0 && arg_offset < argc-1)
  {
   timeout = atoi(argv[arg_offset+1]);
   arg_offset += 2;
  }
  else if (strncmp("-s", argv[arg_offset], 2) == 0)
  {
   use_sudo = 1;
   arg_offset++;
  }
  else if (strncmp("-i", argv[arg_offset], 2) == 0)
  {
   pass_stdin = 1;
   arg_offset++;
  }
  else break;
 }


 if (argc<arg_offset+(!use_sudo)+(!pass_stdin))
 {
  fprintf(stderr, "usage: [-t N] [-s] [-i] <username>? <password>? <command>\n");
  return 1;
 }

 char pass_buff[1024];
 
 if (pass_stdin)
 {
  int len = read(0, &pass_buff, sizeof(pass_buff)-1);
  pass_buff[len] = 0;
 }
 
 char *user;
 
 if (!use_sudo)
 user = argv[arg_offset++];

 char *pass = pass_stdin ? pass_buff : argv[arg_offset++];
 char *command = NULL;
 
 if (argc>arg_offset)
 command = argv[arg_offset];

 if (use_sudo && command)
 {
  run_sudo(pass, command);
  return 0;
 }
 else
 {
  int res = check_password_su(user, pass, timeout);

  if (res == 1)
  {
   fprintf(stderr, "can't login\n");
   return 1;
  }
  else if (res == 2)
  {
   fprintf(stderr, "timeout\n");
   return 2;
  }

  if (command)
  run_su(user, pass, command);
  else
  printf("ok");
 
  return 0;
 }
}
