# Chess-Repertoire-Trainer


Chess Repertoire Trainer is a web application used to practice chess openings using spaced repittion. Save some opening positions to the data and a learning queue will be generated for you to practice with. 

![Image of the homepage](https://i.imgur.com/1t4LNwC.png)



## Dependencies

This app is built using: 

- React
- Vite
- Flask
- SqlAlchemy
- PostgresQL



# How to install and run:

Server and Inital Install:

``` 
    git clone git@github.com:dyldyl123/Chess-Repertoire-Trainer.git
    cd server 
    touch .env.local
    
    pipenv shell
    pip install
    flask --app app run --port=9001 
``` 

Bring your own Local PostgresQL and Secret Key and place them in the .env.local file 


``` 
    cd ../client
    npm install
    npm run dev
```

Then navigate to localhost:5173
