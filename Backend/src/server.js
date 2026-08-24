const app = require('./app');
const config = require('./config');
const {connectDB, closeDB} = require('./config/db');
const logger = require('./utils/logger.js')

const startServer = async () => {
    try{
        await connectDB();

        app.listen(config.port, ()=>{
            // before logger
            // console.log(`server running on port ${config.port}`);

            // after logger
            logger.info(
                {port: config.port},
                "server started successfully"
            )
        });
    }catch(error){
        // before logger
        // console.error(`Server startup failed: `, error.message);

        // after logger
        logger.info(
            {err: error},
            "Server startup failed"
        );
        process.exit(1);
    }
}

const shutdown = async (signal)=>{
    // console.log(`${signal} received. Shutting down gracefully...`);
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