process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 0;
global.LGHVersion = "0.2.9.2";
global.directory = __dirname; //used from /api/database.js
const fs = require("fs");
const TR = require("./api/tg/tagResolver.js");
const cp = require("./api/external/cryptoPrices.js");
const rawConfig = JSON.parse(fs.readFileSync(__dirname + "/config.json"));

const config = {
    ...rawConfig,
    botToken: process.env.BOT_TOKEN || rawConfig.botToken,
    botStaff: process.env.OWNER_ID ? [process.env.OWNER_ID] : rawConfig.botStaff
};


console.log("Starting...")
console.log( "Libre group help current version: " + global.LGHVersion )

function print(text)
{
    console.log( "[index.js] " + text )
}

async function main()
{

    console.log( "Loading languages..." )
    var l = {}//Object that store all languages
    var rLang = config.reserveLang;
    l[rLang] = JSON.parse( fs.readFileSync( __dirname + "/langs/" + rLang + ".json") ); //default language to fix others uncompleted langs
    console.log( "-loaded principal language: \"" + l[rLang].LANG_NAME + "\" " + rLang )

    var langs = fs.readdirSync( __dirname + "/langs" );
    langs.splice( langs.indexOf(rLang + ".json"), 1 );

    var defaultLangObjects = Object.keys(l[rLang])
    langs.forEach( (langFile) => {

        var fileName = langFile.replaceAll( ".json", "" );
        l[fileName] = JSON.parse( fs.readFileSync( __dirname + "/langs/" + langFile ) );
        console.log("-loaded language: \"" + l[fileName].LANG_NAME + "\" " + fileName);

        defaultLangObjects.forEach( (object) => { //detect and fill phrases from incompleted languages with default language (config.reserveLang)

            if( !l[fileName].hasOwnProperty( object ) )
            {

                console.log( "  identified missing paramenter " + object + ", replacing from " + rLang );
                l[fileName][object] = l[rLang][object];

            };

        } )
        
    } );

    global.LGHLangs = l; //add global reference

    
    //load external api if allowed
    if(config.allowExternalApi)
    {
        await cp.load();
    }


    //load bot
    var LGHelpBot = require( "./main.js" );
    var {GHbot, TGbot, db} = await LGHelpBot(config);
    

console.log("Loading modules...");
const pluginsPath = __dirname + "/plugins";
if (!fs.existsSync(pluginsPath)) {
    console.log("❌ No existe la carpeta de plugins.");
} else {
    try {
        const directory = fs.readdirSync(pluginsPath);
        console.log("📦 Archivos encontrados en /plugins:", directory);

        directory.forEach((fileName) => {
            try {
                const func = require(pluginsPath + "/" + fileName);
                func({ GHbot, TGbot, db, config });
                console.log("✅ Plugin cargado:", fileName);
            } catch (error) {
                console.log("❌ Error al cargar el plugin:", fileName);
                console.error(error);
            }
        });
    } catch (err) {
        console.error("❌ Error al leer la carpeta /plugins:", err);
    }
}


    } )


    
    //unload management
    var quitFunc = ()=>{
        db.unload();
        TR.save();
        process.exit(0);
    }
    process.on('SIGINT', quitFunc);  // CTRL+C
    process.on('SIGQUIT', quitFunc); // Keyboard quit
    process.on('SIGTERM', quitFunc); // `kill` command


    console.log("#LibreGroupHelp started#")



}
main();

log para detectar plugins rotos
