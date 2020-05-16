mkdir maythe4.github.io

cd maythe4.github.io

git clone https://github.com/maythe4/maythe4.github.io.git

rm -rvf dice

cp -rv ../dice/dist/dice .

git add --all

git commit -m "message"

git push -u origin master
