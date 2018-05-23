cp hdump.js test-src
cp hdump.test.js test-src
sed -i '1d' test-src/hdump.test.js
java -jar JSCover-all.jar -fs test-src test
firefox 'file:///'`pwd`'/test/jscoverage.html?driver.html'