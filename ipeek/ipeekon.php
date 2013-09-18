<html>
<head></head>
<body>
<?php
$INSTRUMENTS = explode("|", "BT1|BT4|BT5|BT7|BT8|CGD|NGD|NG2|NG3SANS|NG5|NSE|NG7|NG7SANS|DCS|HFBS");
$ip = $_SERVER['REMOTE_ADDR'];
$visitor = @getHostByAddr( $ip );
$id = isset($_GET['id'])?strtoupper($_GET['id']):"---";

// Make sure we are asking about a valid instrument
if (in_array($id, $INSTRUMENTS)) {
    // Instrument is displayed if status/id.on exists, or hidden otherwise.
    $filename = "status/" . strtolower($id) . ".on";

    // Update the instrument status if the query comes from within nist.
    if (isset($_GET['status']) && strtolower(substr($visitor, -9)) == ".nist.gov") {
        if (strtolower($_GET['status'])=='on') {
            touch($filename);
        } else {
            unlink($filename);
        }
    }
	    
    // Return the instrument status
    $state = is_file($filename);
    print $id . '=' . ($state ? '1' : '0');
}   
?>
</body>
</html>
