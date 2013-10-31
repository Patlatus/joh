<?php
function rsd($dir){
    $dirs = array_diff( scandir( $dir ), array( '.', '..' ) );
    $result = '[';
    foreach( $dirs as $d ) {
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

echo rsd('progs');

?>