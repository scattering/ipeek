<?php header('Content-Type: application/json'); ?>
<?php 
function list_files($dir) 
{ 
    $root = scandir($dir);
    $subdir_list = array();
    $files_list = array();
    $files_metadata = array(); 
    foreach($root as $value) 
    { 
        if($value === '.' || $value === '..') {continue;} 
        if(is_file("$dir/$value")) {
            $files_list[] = $value;
            $files_metadata[$value] = array('mtime' => filemtime("$dir/$value"));
            continue;}
        if(is_dir("$dir/$value")) {$subdir_list[]=$value;continue;}
    } 
    return array("subdirs" => $subdir_list, "files" => $files_list, "pathlist" => explode("/", $dir), "files_metadata" => $files_metadata); 
} 
?>

<?php
    //echo join('", "', glob("*.html"));
    $allowed_path = "/var/ftp/pub";
    $path = $allowed_path;
    if (!empty($_POST) && !empty($_POST["pathlist"])) {
        $path .= "/";
        $path .= join("/", $_POST["pathlist"]);
        $path = realpath($path);
    }
    if (!(strpos($path, $allowed_path) === 0)) { echo '{"error": "illegal request", "path": "' . $path . '"}'; }
    else { echo json_encode(list_files($path)); }
?>
