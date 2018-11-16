#!/usr/bin/env bash

# Adding the jdbc driver in maven
mvn install:install-file -Dfile=./jdbc/ojdbc6.jar -DgroupId=com.oracle -DartifactId=ojdbc6 -Dversion=11.2.0 -Dpackaging=jar