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

     exports.syncNotification = async (req, res) => {
         let auth = req.auth;
         let startDate = req.params.startDate;
         let endDate = req.params.endDate;

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