for f in $(find ./node_modules/jade-bootstrap -type f -name '*.pug'); do 
    mv $f $(echo "$f" | sed 's/pug$/jade/')
done
