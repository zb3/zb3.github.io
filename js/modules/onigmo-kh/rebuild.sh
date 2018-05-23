emmake make
emcc -O2 -fvisibility=hidden .libs/libonig.a -o libonig.js -s 'EXPORTED_FUNCTIONS=["_onig_error_code_to_str","_onig_new","_onig_free","_onig_search","_onig_match","_onig_region_new","_onig_region_free",
"_onig_foreach_name","_onig_number_of_names","_onig_number_of_captures","_onig_name_to_backref_number","_malloc","_free","_onig_get_stepcount",
"_onig_getvar_ENCODING_ISO_8859_1","_onig_getvar_SYNTAX_DEFAULT","_onig_getvar_ENCODING_UTF16_LE",
"_onig_getsize_OnigErrorInfo","_onig_set_warn_func","_onig_set_verb_warn_func"]' -s 'EXPORTED_RUNTIME_METHODS=["stringToUTF16", "UTF16ToString","Pointer_stringify","Runtime","writeAsciiToMemory"]' -s 'EXPORT_NAME="libonig"' -s 'MODULARIZE=1' -s 'RESERVED_FUNCTION_POINTERS=6' --memory-init-file 0
echo -e "\nlibonig = libonig();" >> libonig.js