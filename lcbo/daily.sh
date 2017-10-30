#!/bin/bash

# count lines and size of inventory before update
before=$(wc -l inventories.csv)
before_size=$(stat -c '%s' inventories.csv)

# make a back up of inventory in case things fail
cp inventories.csv inventories.csv.bk

# update inventory
node collect.js 2> /dev/null

# get size of inventory right after update to calculate size of downloaded data
after_size=$(stat -c '%s' inventories.csv)

# remove duplicates from inventory
sort inventories.csv|uniq > t.csv
mv t.csv inventories.csv

# count lines of inventory after update
after=$(wc -l inventories.csv)

# commit the new inventory to github
if [ "$before" != "$after" ]; then
		echo "No of products before update: $before"
		echo "No of products after update: $after"
		echo "Inventories updated!"
		#git commit inventories.csv -m "[daily.sh] Updated inventories on $(TZ='America/Toronto' date)" 2>&1 >/dev/null
		#git push origin master 2>&1 >/dev/null
		if [ $? -eq 0 ]
		then
			   echo "Inventories saved to github !"

			   # delete the backup file
		     rm -f inventories.csv.bk
		else
			   echo "Err: Inventories not saved to github !"
		fi
else
		echo "No of products before update: $before"
		echo "No change in inventories!"

    # delete the backup file
    rm -f inventories.csv.bk
fi

# display size of downloaded data
echo "Data downloaded: $(( ($after_size - $before_size)/1048576 )) MB" 
