## Core business logic, background tasks and api server.

#### Init database
$ source ~/d3-venv/bin/activate
$ python
>>> from mr.tools.db.initialization import init_db  
>>> init_db('postgresql+psycopg2://{db_username}:{db_password}@127.0.0.1/reporting')  

For example:  
>>> init_db('postgresql+psycopg2://postgres:postconnectuser@127.0.0.1/reporting')  

#### Run backend
$ source ~/d3-venv/bin/activate
$ python main.py