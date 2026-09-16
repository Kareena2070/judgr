const app = require('./app');
const config = require('./config');
const {connectDB, closeDB} = require('./config/db');
const logger = require('./utils/logger.js')

const startServer = async () => {
    try{
        await connectDB();

        app.listen(config.port, "0.0.0.0", ()=>{
            logger.info(
                {port: config.port},
                "server started successfully"
            )
        });
    }catch(error){
        logger.error(
            {err: error},
            "Server startup failed"
        );
        process.exit(1);
    }
}

const shutdown = async (signal)=>{
    logger.info(
        {signal},
        "Shutting down gracefully..."
    );

    await closeDB();

    process.exit(0);
};

process.on('SIGINT', ()=> shutdown('SIGINT'))
process.on('SIGTERM', ()=> shutdown('SIGTERM'))

startServer();