#!/bin/bash
cd $(realpath "$(dirname $0)")
cd ..
psql postgres -c "drop database dataweaver;" -c "create database dataweaver;"
npm run db:migrate:latest
