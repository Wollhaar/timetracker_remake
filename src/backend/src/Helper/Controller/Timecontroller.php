<?php


namespace DavidGoraj\Helper\Controller;


use DavidGoraj\Classes\Time;
use DavidGoraj\Classes\User;
use DavidGoraj\handle\Database;
use DavidGoraj\handle\Session;
use mysql_xdevapi\Exception;

class Timecontroller
{
    static $database_connection;
    static $tracked = Array();
    static $user;

    public function __construct()
    {
        if (!self::$database_connection) {
            self::$database_connection = new Database();
        }
    }

    public function setUser(User $user)
    {
        self::$user = $user;
    }

    public static function newStamp(Array $stamp)
    {
        if (empty(self::$database_connection)) new self();

        $type = $stamp['type'];
        $start_stop = $stamp['start_stop'];
        $user_id = self::$user->getId();

        $sql = "INSERT INTO `user_timestamps` (
                    `type`,
                    `start_stop`,
                    `user_id`
                ) 
                VALUES (?,?,?);";

        $stmt = self::$database_connection->prepare($sql);
        $stmt->bind_param('ssi',
            $type,
            $start_stop,
            $user_id
        );
        $success = $stmt->execute();

        if (!$success) {
            Session::save(array(
                'code' => 'E201',
                'action' => 'track',
                'message' => 'Timestamp not got tracked.'
            ), 'error');
        }
        return $success;
    }

    public static function getTracking(String $track_area)
    {
        if (empty(self::$database_connection)) new self();

        if ($track_area === 'today') {
            $track_area = date('Y-m-d') . '%';
        }
        $user_id = self::$user->getId();

        $sql = "SELECT * FROM `user_timestamps` 
                WHERE `user_id` = ? AND `timestamp` LIKE ?";

        $stmt = self::$database_connection->prepare($sql);
        $stmt->bind_param('is',
            $user_id,
            $track_area
        );
        $success = $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();

        echo json_encode($result);

        foreach ($result as $stamp) {
            $time = new Time();
            $time->setData($stamp);

            self::$tracked[$time->getId()] = $time;
        }

        if (!$success) {
            Session::save(array(
                'code' => 'E202',
                'action' => 'tracking_list',
                'message' => 'Trackinglist could not be loaded.'
            ), 'error');
        }
        return self::$tracked;
    }
}