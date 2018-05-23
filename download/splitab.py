import gtk, os.path

w = gtk.Window()
w.set_default_size(840, 480)

thespacing = 6
status_ctx = None
status_tskip = 0
autosave = False

main_padding = gtk.Frame()
main_padding.set_border_width(thespacing)
main_padding.set_shadow_type(gtk.SHADOW_NONE)


main_box = gtk.VBox(spacing=thespacing)
source_box = gtk.HBox(spacing=thespacing)
ab_box = gtk.HBox(spacing=thespacing)
a_box = gtk.VBox(spacing=thespacing)
ar_box = gtk.HBox(spacing=thespacing)
b_box = gtk.VBox(spacing=thespacing)
br_box = gtk.HBox(spacing=thespacing)
status_box = gtk.HBox(spacing=thespacing)
sc_exp = gtk.Expander(label="Separator converter")
sc_box = gtk.VBox(spacing=thespacing)
sc_grid = gtk.HBox(spacing=thespacing)
sc_exp.add(sc_box)

main_padding.add(main_box)
w.add(main_padding)
hsep = gtk.VSeparator()
hsep2 = gtk.VSeparator()
hsep3 = gtk.VSeparator()
hsep4 = gtk.VSeparator()
hsep5 = gtk.HSeparator()
main_sep = gtk.HSeparator()

def sc_convert(a):
 sc_file = sc_source_file.get_filename()
 if not sc_file:
  signal_error("No source file selected!")
  return
 sc_sep = sc_source_e.get_active_text().decode('string_escape')
 dst_sep = sc_destination_e.get_active_text().decode('string_escape')
 if not len(sc_source_e.get_active_text()):
  signal_error("Source separator cannot be empty!")
  return
 file_chooser = gtk.FileChooserDialog('Choose destination file', action=gtk.FILE_CHOOSER_ACTION_SAVE, buttons=(gtk.STOCK_CANCEL,gtk.RESPONSE_CANCEL,gtk.STOCK_SAVE,gtk.RESPONSE_OK))
 file_chooser.set_current_folder(os.path.dirname(sc_file))
 file_chooser.set_current_name(os.path.basename(sc_file)+'2')
 res = file_chooser.run()
 dst_file = file_chooser.get_filename()
 file_chooser.destroy()
 if res == gtk.RESPONSE_OK:
  try:
   with open(sc_file) as f:
    with open(dst_file, 'w') as f_dst:
     for c in f:
      f_dst.write(c.replace(sc_sep, dst_sep))
   signal_message("Convert successful.")
  except:
   signal_error("Convert failed.")

def a_select(yarly):
 if not a_selection.count_selected_rows(): return
 b_selection.unselect_all()

def b_select(yarly):
 if not b_selection.count_selected_rows(): return
 a_selection.unselect_all()


changes_made = False

def clear_message():
 global status_tskip, status_ctx
 if status_tskip:
  status_tskip -= 1
  return False
 button8.pop(status_ctx)
 status_ctx = None
 return False

def signal_message(what):
 global status_ctx, status_tskip
 if status_ctx != None:
  button8.pop(status_ctx)
  status_tskip += 1
 nc = button8.get_context_id("why")
 status_ctx = nc
 button8.push(nc, what)
 gtk.timeout_add(2000, clear_message)
 
def signal_error(what):
 error_message = gtk.MessageDialog(w, 0, gtk.MESSAGE_ERROR, gtk.BUTTONS_OK, what)
 error_message.set_title("Error")
 error_message.run()
 error_message.destroy()

def not_in_model(model, what):
 for t in model:
  if t[0] == what:
   return False
 return True

def read_into(fname, model_one, model_two):
 with open(fname) as f:
  for line in f:
   line = line.rstrip()
   #now, append this to model_one, but delete from model_two if not None
   model_one.append([line])
   update_item_count()
   if model_two and not not_in_model(model_two, line):
    model_two.remove(x.iter)
    update_item_count()

def key_press(widget, event):
 if event.state & gtk.gdk.CONTROL_MASK and event.keyval == 115:
  save_AB(1)

def toggle_autosave(btn):
 global autosave

 if btn.get_active():
  autosave = True
  save_AB(1, 1)
 else:
  autosave = False

def set_changed():
 global changes_made
 if not changes_made:
  w.set_title('*'+w.get_title())
 changes_made=True
 if autosave:
  save_AB(1)

def unset_changed():
 global changes_made
 if changes_made:
  w.set_title(w.get_title()[1:])
 changes_made=False

def update_item_count():
 a_count_label.set_label(str(len(a_model))+" items")
 b_count_label.set_label(str(len(b_model))+" items")

def save_model(fname, model):
 with open(fname, 'w') as f:
  for t, x in enumerate(model):
   f.write(x[0])
   if t != len(model)-1:
    f.write('\n')

def save_AB(a, quiet=False):
 #don't throw stuf
 global changes_made
 fname_a = button13.get_filename()
 fname_b = button16.get_filename()

 if fname_a == None:
  if not quiet:
   signal_error("No A file selected!")
  return False
 
 if fname_b == None:
  if not quiet:
   signal_error("No B file selected!")
  return False
  save_model(fname_a, a_model)
  save_model(fname_b, b_model)
 try:
  save_model(fname_a, a_model)
 except:
  signal_error("Failed to save A.")
  return False
  
 try:
  save_model(fname_b, b_model)
 except:
  signal_error("Failed to save B.")
  return False
 
 signal_message("AB saved successfully.")
 unset_changed()

 return True

def revert_AB(a):
 fname_a = button13.get_filename()
 fname_b = button16.get_filename()

 if fname_a == None:
  signal_error("No A file selected!")
  return
 
 if fname_b == None:
  signal_error("No B file selected!")
  return

 really = gtk.MessageDialog(w, 0, gtk.MESSAGE_QUESTION, gtk.BUTTONS_YES_NO, "Do you really want to revert?")
 really.set_title("Revert?")
 res = really.run()
 really.destroy()
 if res == gtk.RESPONSE_NO:
  return
 a_model.clear()
 update_item_count()
 try:
  read_into(fname_a, a_model, None)
 except:
  signal_error("Failed to read into A")
  return

 b_model.clear()
 update_item_count()
 try:
  read_into(fname_b, b_model, None)
 except:
  signal_error("Failed to read into B")
  return

 signal_message("Revert successful.")
 unset_changed()

def fill_not_B(a):
 fname = button2.get_filename()

 if fname == None:
  signal_error("No source file selected!")
  return

 try:
  with open(fname) as f:
   for line in f:
    line = line.rstrip()
    if not_in_model(a_model, line) and not_in_model(b_model, line):
     a_model.append([line])
     set_changed()
     update_item_count()
  signal_message("Fill successful")
 except:
  signal_error("Failed to read source file!")
 return


def fill_not_A(a):
 fname = button2.get_filename()

 if fname == None:
  signal_error("No source file selected!")
  return

 try:
  with open(fname) as f:
   for line in f:
    line = line.rstrip()
    if not_in_model(a_model, line) and not_in_model(b_model, line):
     b_model.append([line])
     update_item_count()
     set_changed()
  signal_message("Fill successful")
 except:
  signal_error("Failed to read source file!")
 return

def load_A(a):
 fname = button13.get_filename()
 if fname == None:
  signal_error("No A file selected!")
  return

 a_model.clear()
 update_item_count()

 try:
  read_into(fname, a_model, b_model)
  signal_message("Loaded A successfully.")
 except:
  signal_error("Failed to load A.")
  return

def load_B(a):
 fname = button16.get_filename()
 if fname == None:
  signal_error("No B file selected!")
  return

 b_model.clear()
 update_item_count()

 try:
  read_into(fname, b_model, a_model)
  signal_message("Loaded B successfully.")
 except:
  signal_error("Failed to load B.")
  return
 
def clear_A(a):
 really = gtk.MessageDialog(w, 0, gtk.MESSAGE_QUESTION, gtk.BUTTONS_YES_NO, "Do you really want to clear A?")
 really.set_title("Clear?")
 res = really.run()
 really.destroy()
 if res == gtk.RESPONSE_NO:
  return
 for x in a_model:
  b_model.append([x[0]])
 a_model.clear()
 update_item_count()
 set_changed()

def clear_B(a):
 really = gtk.MessageDialog(w, 0, gtk.MESSAGE_QUESTION, gtk.BUTTONS_YES_NO, "Do you really want to clear B?")
 really.set_title("Clear?")
 res = really.run()
 really.destroy()
 if res == gtk.RESPONSE_NO:
  return
 for x in b_model:
  a_model.append([x[0]])
 b_model.clear()
 update_item_count()
 set_changed()

def offer_save():
 discard_changes = gtk.MessageDialog(w, 0, gtk.MESSAGE_QUESTION, gtk.BUTTONS_NONE, "You have unsaved changes, save them?")
 discard_changes.add_button(gtk.STOCK_NO, gtk.RESPONSE_NO)
 discard_changes.add_button(gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL)
 discard_changes.add_button(gtk.STOCK_YES, gtk.RESPONSE_YES)
 discard_changes.set_title("Save changes?")
 res = discard_changes.run()
 discard_changes.destroy()
 if res == gtk.RESPONSE_CANCEL:
  return True
 elif res == gtk.RESPONSE_YES:
  return not save_AB(1)
 return False

def load_source(a):
 fname = button2.get_filename()
 if fname == None:
  signal_error("No file selected!")
  return
 if changes_made:
  if offer_save():
   return

 fname_a = fname+'_a'
 fname_b = fname+'_b'

 a_model.clear()
 b_model.clear()

 update_item_count()

 if os.path.isfile(fname_a):
  button13.set_filename(fname_a)
  button16.set_filename(fname_b)

  try:
   read_into(fname_a, a_model, None)
  except:
   signal_error("Failed to load A.")
   return

  if os.path.isfile(fname_b):
   try:
    read_into(fname_b, b_model, None)
   except:
    signal_error("Failed to load B.")
    return
 else:
  open(fname_a, 'a')
  open(fname_b, 'a')
  button13.set_filename(fname_a)
  button16.set_filename(fname_b)

  try:
   read_into(fname, a_model, None)
   save_AB(1)
  except:
   signal_error("Load failed.")
   return
 signal_message("Load successful.")
 unset_changed()

tmp_man = None
def a_act(a, b, c):
 tmp_man = a_model[b[0]][0]
 a_model.remove(a_model[b[0]].iter)
 b_model.append([tmp_man])
 if len(a_model):
  a_selection.select_iter(a_model[min(b[0], len(a_model)-1)].iter)
 a_view.grab_focus()
 update_item_count()
 set_changed()

def b_act(a, b, c):
 tmp_man = b_model[b[0]][0]
 b_model.remove(b_model[b[0]].iter)
 a_model.append([tmp_man])
 if len(b_model):
  b_selection.select_iter(b_model[min(b[0], len(b_model)-1)].iter)
 b_view.grab_focus()
 update_item_count()
 set_changed()

a_model = gtk.ListStore(str)
b_model = gtk.ListStore(str)

a_view = gtk.TreeView(a_model)
b_view = gtk.TreeView(b_model)


a_renderer = gtk.CellRendererText()
b_renderer = gtk.CellRendererText()

a_column = gtk.TreeViewColumn("Ogaboga", a_renderer, text=0)
b_column = gtk.TreeViewColumn("Ogaboga", b_renderer, text=0)

a_view.append_column(a_column)
b_view.append_column(b_column)
a_view.set_headers_visible(False)
b_view.set_headers_visible(False)
a_selection = a_view.get_selection()
a_selection.connect("changed", a_select)
b_selection = b_view.get_selection()
b_selection.connect("changed", b_select)
a_view.connect("row-activated", a_act)
b_view.connect("row-activated", b_act)


a_view_real = gtk.ScrolledWindow()
a_view_real.set_policy(gtk.POLICY_AUTOMATIC, gtk.POLICY_AUTOMATIC);
a_view_real.add(a_view)
a_view_real.set_shadow_type(gtk.SHADOW_IN)

b_view_real = gtk.ScrolledWindow()
b_view_real.set_policy(gtk.POLICY_AUTOMATIC, gtk.POLICY_AUTOMATIC);
b_view_real.add(b_view)
b_view_real.set_shadow_type(gtk.SHADOW_IN)

button1 = gtk.Label("Source file:")
button2 = gtk.FileChooserButton("Choose source file")
button2.connect("file-set", load_source)
button4 = gtk.Button(label="Save AB")
button4.connect("clicked", save_AB)
button5 = gtk.Button(label="Revert AB")
button5.connect("clicked", revert_AB)
button6 = gtk.Button(label="Button 6")
button7 = gtk.Button(label="Button 7")
button8 = gtk.Statusbar()
button8.push(0, "")
button9 = gtk.Button(label="Button 9")
button10 = gtk.Button(label="Button 10")
button11 = gtk.Button(label="Clear")
button11.connect("clicked", clear_A)
fill_not_btn = gtk.Button(label="Fill not B")
fill_not_btn.connect("clicked", fill_not_B)
button12 = gtk.Label("A file:")
button13 = gtk.FileChooserButton("Choose A file")
button14 = gtk.Button(label="Clear")
button14.connect("clicked", clear_B)
fill_not_atn = gtk.Button(label="Fill not A")
fill_not_atn.connect("clicked", fill_not_A)
button15 = gtk.Label("B file:")
button16 = gtk.FileChooserButton("Choose B file")
button17 = gtk.Button(label="Load to A")
button17.connect("clicked", load_A)
button18 = gtk.Button(label="Load to B")
button18.connect("clicked", load_B)

button20 = gtk.CheckButton(label="Auto save")
button20.connect("toggled", toggle_autosave)

a_count_label = gtk.Label("0 items")
a_count_label.set_alignment(xalign=0.0, yalign=0.5)
a_count_label_padding = gtk.Frame()
a_count_label_padding.set_border_width(0)
a_count_label_padding.set_shadow_type(gtk.SHADOW_IN)
a_count_label_padding.add(a_count_label)
b_count_label = gtk.Label("0 items")
b_count_label.set_alignment(xalign=0.0, yalign=0.5)
b_count_label_padding = gtk.Frame()
b_count_label_padding.set_border_width(0)
b_count_label_padding.set_shadow_type(gtk.SHADOW_IN)
b_count_label_padding.add(b_count_label)

sc_source_label = gtk.Label("Source file:")
sc_source_elabel = gtk.Label("Source separator:")
sc_source_e = gtk.combo_box_entry_new_text()
sc_source_e.append_text('\\n')
sc_source_e.append_text('\\r\\n')
sc_source_e.append_text(' ')
sc_source_e.append_text(',')
sc_source_e.append_text(', ')
sc_source_e.append_text(';')
sc_source_e.append_text('; ')
sc_source_e.append_text('|')
sc_source_e.set_active_iter(sc_source_e.get_model()[0].iter)
cs = sc_source_e.get_size_request()
sc_source_e.set_size_request(60, cs[1])

sc_destination_e = gtk.combo_box_entry_new_text()
sc_destination_e.append_text('\\n')
sc_destination_e.append_text('\\r\\n')
sc_destination_e.append_text(' ')
sc_destination_e.append_text(',')
sc_destination_e.append_text(', ')
sc_destination_e.append_text(';')
sc_destination_e.append_text('; ')
sc_destination_e.append_text('|')
sc_destination_e.set_active_iter(sc_destination_e.get_model()[2].iter)
sc_destination_e.set_size_request(60, cs[1])

sc_source_label.set_alignment(xalign=1.0, yalign=0.5)
sc_source_elabel.set_alignment(xalign=1.0, yalign=0.5)

sc_destination_elabel = gtk.Label("Destination separator:")
sc_source_file = gtk.FileChooserButton("Choose source file")
sc_convert_button = gtk.Button(label="Convert")
sc_convert_button.connect("clicked", sc_convert)
#grid layout would be better in this case
#ok, so we can simplify this alot!
sc_grid.pack_start(sc_source_label, False, False, 0)
sc_grid.pack_start(sc_source_file, True, True, 0)
sc_grid.pack_start(sc_source_elabel, False, False, 0)
sc_grid.pack_start(sc_source_e, False, False, 0)
sc_grid.pack_start(sc_destination_elabel, False, False, 0)
sc_grid.pack_start(sc_destination_e, False, False, 0)

sc_box.pack_start(sc_grid, False, False, 0)
sc_box.pack_start(sc_convert_button, False, False, 0)


source_box.pack_start(button1, False, False, 0)
source_box.pack_start(button2, True, True, 0)
source_box.pack_start(hsep, False, False, 0)
source_box.pack_start(button4, False, False, 0)
source_box.pack_start(button5, False, False, 0)
source_box.pack_start(button20, False, False, 0)
ab_box.pack_start(a_box, True, True, 0)
a_box.pack_start(ar_box, False, False, 0)
ar_box.pack_start(button11, False, False, 0)
ar_box.pack_start(fill_not_btn, False, False, 0)
ar_box.pack_start(hsep2, False, False, 0)
ar_box.pack_start(button12, False, False, 0)
ar_box.pack_start(button13, True, True, 0)
ar_box.pack_start(button17, False, False, 0)
a_box.pack_start(a_view_real, True,  True, 0)
a_box.pack_start(a_count_label_padding, False,  False, 0)
ab_box.pack_start(hsep4, False, False, 0)
ab_box.pack_start(b_box, True, True, 0)
b_box.pack_start(br_box, False, False, 0)
br_box.pack_start(button14, False, False, 0)
br_box.pack_start(fill_not_atn, False, False, 0)
br_box.pack_start(hsep3, False, False, 0)
br_box.pack_start(button15, False, False, 0)
br_box.pack_start(button16, True, True, 0)
br_box.pack_start(button18, False, False, 0)
b_box.pack_start(b_view_real, True,  True, 0)
b_box.pack_start(b_count_label_padding, False,  False, 0)
status_box.pack_start(button8, True, True, 0)

main_box.pack_start(sc_exp, False, False, 0)
main_box.pack_start(main_sep, False, False, 0)

main_box.pack_start(source_box, False, False, 0)
main_box.pack_start(ab_box, True, True, 0)
main_box.pack_start(status_box, False, False, 0)
"""
save on ctrl s
"""

def exit_app(a,b):
 if changes_made:
  return offer_save()
 return False

w.connect('delete_event', exit_app)
w.connect('key_press_event', key_press)
w.connect('destroy', gtk.main_quit)
w.set_title('SplitAB')
w.show_all()

gtk.main()