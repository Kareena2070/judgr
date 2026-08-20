const { Signal } = require('lucide-react');
const app = require('./app');
const config = require('./config');
const {connectDB, closeDB} = require('./config/db');

const startServer = async () => {
    try{
        await connectDB();

        app.listen(config.port, ()=>{
            console.log(`server running on port ${config.port}`);
        });
    }catch(error){
        console.error(`Server startup failed: `, error.message);
        process.exit(1);
    }
}

const shutdown = async (signal)=>{
    console.log(`${signal} received. Shutting down gracefully...`);

    await closeDB();

    process.exit(0);
};

process.on('SIGINT', ()=> shutdown('SIGINT'))
process.on('SIGTERM', ()=> shutdown('SIGTERM'))

startServer();