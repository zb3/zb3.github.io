#include <stdio.h>
#include <unistd.h>
#include <time.h>
#include <sys/select.h>
#include <termios.h>

//pauseable terminal stopwatch.
//couldn't find it anywhere :<
//ok maybe I can't name it properly
//and that's why I couldn't find it
//but at least I can write some code YAY!

//press space to pause/resume
//press n or enter for new result
//press c, q, x or ctrl-c to stop
//press r to restart @ newline

char maybe_getchar()
{
 int nfds = 0;
 struct timeval tv = {0L, 1000000L};
 fd_set readfds;
 FD_ZERO(&readfds);
 FD_SET(0, &readfds);
     
 int count = select(1, &readfds, NULL, NULL, &tv);
 if (count > 0 && FD_ISSET(0, &readfds))
 return getchar();

 return 0;
}

void echo_time(time_t sec)
{
 time_t min = sec/60;
 time_t hr = min/60;
 
 min %= 60;
 sec %= 60;

 printf("\r%02d:%02d:%02d", hr, min, sec);
 fflush(stdout);
}

int main()
{
 static struct termios to, tnew;

 tcgetattr(0, &to);
 tnew = to;
 tnew.c_lflag &= ~ICANON & ~ECHO;
 tcsetattr(0, TCSANOW, &tnew);
 
 time_t bias = 0;
 
 time_t current_base = time(NULL);
 time_t now;
 int paused = 0;
 
 while(1)
 {
  if (!paused)
  {
   now = time(NULL);
   echo_time(bias + now - current_base);
  }
  
  char c = maybe_getchar();
 
  if (c == 32) //pause / resume
  {
   now = time(NULL);
   
   if (!paused)
   {
    bias += now - current_base;
    printf(" - paused");
    fflush(stdout);
   } 
   else
   {
    current_base = now;
    printf("\r\033[K"); //clear the line so that we won't see " - paused" anymore
    fflush(stdout);
   } 

   paused = !paused;
  }
  else if (c == 110 || c == 10 || c == 114 || c == 27 || c == 99 || c == 120 || c == 113) //newline
  {
   printf("\n");
   fflush(stdout);
   
   if (c == 114) //reset
   {
    bias = 0;
    current_base = time(NULL);
   }
   else if (c == 27 || c == 99 || c == 120 || c == 113) //quit
   break;
  }
 }
 
 tcsetattr(0, TCSANOW, &to);
 
 return 0;
}