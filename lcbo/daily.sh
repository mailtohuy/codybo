#!/bin/bash
before=$(wc -l inventories.csv)
echo "$before" 
node collect.js > /dev/null 
sort inventories.csv|uniq > t.csv
rm inventories.csv
mv t.csv inventories.csv
after=$(wc -l inventories.csv)
echo "$after" 
if [ "$before" == "$after" ]; then
	echo "Inventories updated"
	git commit inventories.csv -m "Updated inventories on $(date)" 
fi
