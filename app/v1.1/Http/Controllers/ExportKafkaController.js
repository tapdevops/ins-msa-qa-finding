/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    //Models
    const FindingModel = require( _directory_base + '/app/v1.1/Http/Models/Finding.js' );

    //Libraries
    const KafkaServer = require( _directory_base + '/app/v1.1/Http/Libraries/KafkaServer.js' );

    //export finding to kafka
    exports.export_finding = async ( req, res ) => {
        const query = await FindingModel.aggregate( [
            {
                $project: {
                    _id: 0
                }
            }
        ] );

        query.forEach( function( data ) {
            let kafka_body = {
                FNDCD: data.FINDING_CODE,
                WERKS: data.WERKS,
                AFD_CODE: data.AFD_CODE,
                BLOCK_CODE: data.BLOCK_CODE,
                FNDCT: data.FINDING_CATEGORY,
                FNDDS: data.FINDING_DESC,
                FNDPR: data.FINDING_PRIORITY,
                DUE_DATE: data.DUE_DATE,
                ASSTO: data.ASSIGN_TO,
                PRGRS: data.PROGRESS,
                LATFN: data.LAT_FINDING,
                LONFN: data.LONG_FINDING,
                RFINC: data.REFFERENCE_INS_CODE,
                INSUR: data.INSERT_USER,
                INSTM: data.INSERT_TIME,
                UPTUR: data.UPDATE_USER,
                UPTTM: data.UPDATE_TIME,
                DLTUR: data.DELETE_USER,
                DLTTM: data.DELETE_TIME,
                RTGVL: data.RATING_VALUE,
                RTGMS: data.RATING_MESSAGE,
                END_TIME: data.END_TIME
            }
            KafkaServer.producer( 'INS_MSA_FINDING_TR_FINDING', JSON.stringify( kafka_body ) );
        } );
        res.send( {
            message: true
        } )
    }

 