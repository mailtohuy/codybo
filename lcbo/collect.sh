#!/bin/bash

cd /home/mailtohuy/projects/codybo/lcbo

# edit PATH for cron job
PATH=$PATH:/usr/local/bin:/opt/bitnami/nodejs/bin
echo $PATH

# Get OS name since stat syntax is different across Linux, Mac and Debian
os=$(uname)

# Echo current date
TZ='America/Toronto' date

# count lines and size of inventory before update

before=$(wc -l inventories.csv)

if [ "$os" == "Linux" ]; then
	before_size=$(stat -c '%s' inventories.csv 2>/dev/null)
elif [[ "$os" == "Darwin" ]]; then
	before_size=$(stat -f '%z' inventories.csv 2>/dev/null)
fi

# make a back up of inventory in case things fail
cp inventories.csv inventories.csv.bk

# update inventory
node collect.js > /dev/null

# get size of inventory right after update to calculate size of downloaded data

if [ "$os" == "Linux" ]; then
	after_size=$(stat -c '%s' inventories.csv 2>/dev/null)
elif [[ "$os" == "Darwin" ]]; then
	after_size=$(stat -f '%z' inventories.csv 2>/dev/null)
fi

# remove duplicates from inventory
sort inventories.csv|uniq > t.csv
mv t.csv inventories.csv

# count lines of inventory after update
after=$(wc -l inventories.csv)


# compare inventory level
if [ "$before" != "$after" ]; then
		echo "No of products before update: $before"
		echo "No of products after update: $after"
		echo "Inventories updated!"

		if [ $? -eq 0 ]
		then
		    # delete the backup file
		    rm -f inventories.csv.bk
		fi
else
		echo "No of products before update: $before"
		echo "No change in inventories!"

    # delete the backup file
    rm -f inventories.csv.bk
fi

# display size of downloaded data
echo "Mobile data used: $(( $after_size - $before_size )) bytes"

#echo current date
TZ='America/Toronto' date

