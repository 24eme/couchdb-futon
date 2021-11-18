# Couchdb Futon

This project is a fork of https://github.com/apache/couchdb-futon

The goal of this fork is to maintain Couchdb Futon compatible with newer couchdb versions.

Currently in this fork main features are compatible with couchdb version 2.x and 3.x.

## Deploy Futon on couchdb 2.x or 3.x instead of Fauxton

In couchdb installation folder (/opt/couchdb with ubuntu couchdb package) :

```
cd /opt/couchdb/share
git clone https://github.com/24eme/couchdb-futon.git
mv www couchdb-fauxton # Unpublish Fauxton
ln -s couchdb-futon www # Publish Futon
```

Now it's Futon that is used instead of Fauxton : http://localhost:5984/_utils/
