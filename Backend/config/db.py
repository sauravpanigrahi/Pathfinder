from sqlalchemy import create_engine ### it is used to create a database engine
from sqlalchemy.ext.declarative import declarative_base ### it is used to create a base class for the database models
from sqlalchemy.orm import sessionmaker ### it is used to create a session for the database

DATABASE_URL = "mysql+pymysql://root:mysql%40database@localhost:3306/PathFinder"

engine=create_engine(DATABASE_URL)
Sessionlocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)###autocommit=False means changes are not immediately saved to the database after each statement.
###autoflush=False disables this, so uncommitted changes aren’t automatically synchronized with the database before queries unless flush() is explicitly called.
Base=declarative_base()