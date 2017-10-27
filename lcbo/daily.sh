#!/bin/bash
before=$(wc -l inventories.csv)
echo "$before"
cp inventories.csv inventories.csv.bk
node collect.js 2> /dev/null
sort inventories.csv|uniq > t.csv
mv t.csv inventories.csv
after=$(wc -l inventories.csv)
if [ "$before" != "$after" ]; then
	echo "$after"
	git commit inventories.csv -m "Updated inventories on $(date)"
	echo "Inventories updated!"
else
	echo "No change in inventories!"
fi
rm -f inventories.csv.bk
