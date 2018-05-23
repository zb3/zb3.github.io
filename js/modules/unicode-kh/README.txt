these are old scripts I've used to generate the data for unicode.js file...

first of all, you need to download unicode data into the "u" folder (so that it contains file named "UnicodeData.txt")
then:

>findmap.py was used to find unicode "maps" (like sans-serif bold, circled, parenthesized etc)
>then ournames.file contains lines in the form "unicode map name | map description"

>domap.py helps creating ourmaps.file, although it's a bit manual thing (we use addbyprefix)
>doconv.py creates unicodemapper literal from ourmaps.file, to be pasted to unicode.js

>docomb.py creates comb.file, similarily to domap.py
>cmbe.py creates combining literal for unicode.js