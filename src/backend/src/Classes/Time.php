<?php


namespace DavidGoraj\Classes;


class Time
{
    private $id;
    private $timestamp;
    private $type;
    private $start_stop;
    private $user_id;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * @param mixed $timestamp
     */
    public function setTimestamp($timestamp): void
    {
        $this->timestamp = $timestamp;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type): void
    {
        $this->type = $type;
    }

    /**
     * @return mixed
     */
    public function getStartStop()
    {
        return $this->start_stop;
    }

    /**
     * @param mixed $start_stop
     */
    public function setStartStop($start_stop): void
    {
        $this->start_stop = $start_stop;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->user_id;
    }

    /**
     * @param mixed $user_id
     */
    public function setUserId($user_id): void
    {
        $this->user_id = $user_id;
    }


    /**
     * @return array
     */
    public function getData(): array
    {
        return Array(
            'id' => $this->id,
            'timestamp' => $this->timestamp,
            'type' => $this->type,
            'start_stop' => $this->start_stop,
            'user_id' => $this->user_id
        );
    }

    /**
     * @param array $data
     */
    public function setData(Array $data): void
    {
        $this->id = $data['id'];
        $this->timestamp = $data['timestamp'];
        $this->type = $data['type'];
        $this->start_stop = $data['start_stop'];
        $this->user_id = $data['user_id'];
    }


}