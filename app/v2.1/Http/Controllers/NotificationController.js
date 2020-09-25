/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
     // Models
     Notification = require( _directory_base + '/app/v2.1/Http/Models/Notification.js');

     const { v4: uuidv4 } = require('uuid');

     exports.syncNotification = async (req, res) => {
         let auth = req.auth;
         let startDate = parseInt(req.params.startDate);
         let endDate = parseInt(req.params.endDate);

         try {
             let notification = await Notification.aggregate([
                 {
                     $match: {
                         INSERT_TIME: {
                             $gte: startDate,
                             $lte: endDate
                         },
                         NOTIFICATION_TO: auth.USER_AUTH_CODE
                     }
                 }, {
                     $project: {
                         _id: 0
                     }
                 }
             ]);
             return res.send({
                 status: true,
                 message: 'success',
                 data: notification
             });
         } catch(err) {
            console.log(err);
            return res.send({
                status: false,
                message: 'internal server error',
                data: []
            });
         }
     }

    exports.create = async ( req, res ) => {
        let body = req.body;
        try {
            body.NOTIFICATION_ID = uuidv4();
            let notification = new Notification(body);
            await notification.save();
            res.send({
                status: true,
                message: 'success',
                data: []
            })
        } catch(err) {
            console.log(err)
            res.send({
                status: false,
                message: 'internal server error',
                data: []
            });
        }

    }