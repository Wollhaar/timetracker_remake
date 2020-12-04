<?php


namespace DavidGoraj\Helper\Controller;


use DavidGoraj\Classes\Time;
use DavidGoraj\Classes\User;
use DavidGoraj\handle\Database;
use DavidGoraj\handle\Session;
use mysql_xdevapi\Exception;

class TimeController
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

    public static function setUser(User $user)
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

    public static function getTrack(String $id)
    {
        $user_id = self::$user->getId();

        // check for deleted track
        $sql = "SELECT * FROM `user_timestamps` 
                WHERE `id` = ? 
                AND `user_id` = ? 
                LIMIT 1";

        $stmt = self::$database_connection->prepare($sql);
        $stmt->bind_param('ii',
            $id,
            $user_id
        );
        $stmt->execute();
        $result = $stmt->get_result()->fetch_row();

        return $result;
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
        $result = $stmt->get_result();

        foreach ($result as $stamp) {
            $time = new Time();
            $time->setData($stamp);

            self::$tracked[$time->getId()] = $stamp;
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

    public static function getAllTracks()
    {
        if (empty(self::$database_connection)) new self();

        $user_id = self::$user->getId();

        $sql = "SELECT * FROM `user_timestamps` 
                WHERE `user_id` = ?";

        $stmt = self::$database_connection->prepare($sql);
        $stmt->bind_param('i', $user_id);
        $success = $stmt->execute();
        $result = $stmt->get_result();

        foreach ($result as $stamp) {
            $time = new Time();
            $time->setData($stamp);

            self::$tracked[$time->getId()] = $stamp;
        }

        if (!$success) {
            Session::save(array(
                'code' => 'E203',
                'action' => 'tracking_list',
                'message' => 'Trackinglist could not be loaded.'
            ), 'error');
        }
        return self::$tracked;
    }

    public static function updateTime(array $track)
    {
        if (empty(self::$database_connection)) new self();

        $user_id = self::$user->getId();

        $sql = "UPDATE `user_timestamps` 
                SET `timestamp` = ? 
                WHERE `id` = ? 
                AND `user_id` = ? 
                LIMIT 1";
        $stmt = self::$database_connection->prepare($sql);
        $stmt->bind_param('ssi',
            $track['timestamp'],
            $track['id'],
            $user_id
        );
        $success = $stmt->execute();

        if (!$success) {
            Session::save(array(
                'code' => 'E204',
                'action' => 'update_track',
                'message' => 'Track could not be updated.'
            ), 'error');
        }
        return $success;
    }

    public static function delete(String $id)
    {
        if (empty(self::$database_connection)) new self();

        $user_id = self::$user->getId();

        $sql = "DELETE FROM `user_timestamps` 
                WHERE `id` = ? 
                AND `user_id` = ? 
                LIMIT 1";

        $stmt = self::$database_connection->prepare($sql);
        $stmt->bind_param('ii',
            $id,
            $user_id
        );
        $stmt->execute();

        // check for deleted track
        $success = self::getTrack($id);

        if (!$success) {
            Session::save(array(
                'code' => 'E205',
                'action' => 'delete_track',
                'message' => 'Track could not be deleted.'
            ), 'error');
        }
        return $success;
    }
}