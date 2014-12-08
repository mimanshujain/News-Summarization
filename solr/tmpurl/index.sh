file="urls";
echo $$ > index.pid
while true;
do
sleep 1
if [ -f $file ]; then
sleep 1
echo "File exists" $file
/usr/bin/java -jar Guardianindexer.jar ul http://localhost:8983/solr/newscollection /home/ubuntu/applications/tmpurl/$file 200
rm -f $file
fi 	
done
