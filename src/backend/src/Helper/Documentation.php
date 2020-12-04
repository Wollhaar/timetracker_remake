<?php


namespace DavidGoraj\Helper;

use DavidGoraj\Classes\User;
use TCPDF;

class Documentation extends TCPDF
{
    private $name;
    private $user;

    const path = DOC_ROOT . DIRECTORY_SEPARATOR . 'docus';

    public function __construct(String $name, User $user)
    {
        parent::__construct();

        $this->name = $user->getEmployeeNr() . '_(' .
            $user->getLastname() . '_' .
            $user->getFirstname() . ')_' .
            'TrackDocu_' . $name;

        $this->user = $user;
    }

    public function prepare()
    {
        $this->author = $this->user->getFirstname() . ' ' . $this->user->getLastname();
        $this->creator = $this->user->getUsername();

        // Neue Seite
        $this->AddPage();
    }

    public function fill(Array $data)
    {
        $html = $this->prepareHTML($data);

        // Fügt den HTML Code in das PDF Dokument ein
        $this->writeHTML($html, true, false, true, false, '');
    }

    public function create()
    {
        $this->Output(self::path . DIRECTORY_SEPARATOR . $this->name . '.pdf', 'F');
        return 'http://backend.timetracker.de:8090' . DIRECTORY_SEPARATOR
            . 'docus' . DIRECTORY_SEPARATOR .
            $this->name . '.pdf';
    }

    public function prepareHTML(Array $data)
    {
        global $months;
        $html = '<ul>';
        foreach ($data AS $y => $year) {

            $html .= "<li>$y</li><ul>";
            foreach($year AS $m => $month) {

                $mHeader = $months[$m]['short'] . ' ' .
                    round($month['time'] / 1000 / 60 / 60, 1,
                        PHP_ROUND_HALF_ODD) . ' Std';
                $html .= "<li>$mHeader</li><ul>";

                unset($month['time']);
                foreach($month AS $d => $time) {
                    $time = round($time / 1000 / 60 / 60, 1,
                            PHP_ROUND_HALF_DOWN) . ' Std';
                    $html .= "<li>$d $time</li>";
                }
                $html .= "</ul>";
            }
            $html .= "</ul>";
        }
        $html .= "</ul>";

        return $html;
    }
}