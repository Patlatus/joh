<?php
$dbhost = "localhost";
$dblogin = "peter";
$dbpass = "abc123";
$dbname = "plans";
$plans = "plans";
$users = "users";

function rsd($dir){
    $dirs = array_diff( scandir( $dir ), array( '.', '..' ) );
    $result = '[';
    $first = true;
    foreach( $dirs as $d ) {
        if (!$first) {
            $result .= ',';
        }
        if ($first) {
            $first = false;
        }
        if( is_dir($dir."/".$d) ) {
            $result .= "{name:'".$d."',fullpath:'".$dir."/".$d."',type:'folder',data:".rsd($dir."/".$d).'}';
        } else {
            $ext = pathinfo($d, PATHINFO_EXTENSION);
            $result .= "{name:'".$d."',fullpath:'".$dir."/".$d."',type:'".$ext. "'}";
        }
    }
    $result .= ']';
    return $result;
}
?>