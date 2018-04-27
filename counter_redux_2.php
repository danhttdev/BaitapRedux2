<?php
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

function processing($id, $role, $oldValue, $newValue){
	$conn = mysqli_connect('localhost', 'root', '12345678', 'baitapreact1') or die ('Không thể kết nối tới database');
    $gap = $newValue - $oldValue;
    $isUp = ($gap)>0?true:false;
    if ($role === 1){
        // parent increase
        $response = new StdClass();
        if ($isUp){
            $response->key = "PARENT_INCREASE";
            $response->id = $id;
            $sqlInsert = "INSERT INTO btcounter (id,valueCounter,roleCounter) VALUES (rand(),1,0)";
            $num2 = $gap;
            while($num2--){
                $kq = mysqli_query($conn,$sqlInsert);
            }
            // cap nhat Dad
            $sqlUpdateDad = "UPDATE btcounter SET valueCounter = valueCounter + '$gap' WHERE roleCounter=1";
            $data = array();
            $sqlGetValueDad = "SELECT valueCounter FROM btcounter WHERE roleCounter=1";
            if (mysqli_query($conn,$sqlUpdateDad)){
                if ($result = mysqli_query($conn,$sqlGetValueDad)){
                    $row = mysqli_fetch_assoc($result);
                    $response->value=$row['valueCounter'];
                }
            }
            // lay chieu dai CSDL
            $sqlCount = "SELECT COUNT(*) FROM btcounter";
            $length = mysqli_fetch_array(mysqli_query($conn, $sqlCount))[0];
            $sqlGetRecord = " SELECT * FROM btcounter WHERE roleCounter = 0";
            $resultGetRecord = mysqli_query($conn, $sqlGetRecord);
            $i = 0;
            while($row = mysqli_fetch_assoc($resultGetRecord))
            {
                $i += 1;
                if ( $i >= ($length - $gap) )	array_push($data, array('id' => $row['id'], 'value' => intval($row["valueCounter"]),'role'=> intval($row["roleCounter"])));
            }
            $response->content=$data;
            $json = json_encode($response);
            echo $json;
        } else {
        // parent decrease
            $response->key="PARENT_DECREASE";
            $response->id=$id;
            $sqlDelete = "DELETE FROM btcounter WHERE roleCounter = 0 ORDER BY indexCounter DESC LIMIT 1";
            $data = array();
            $sqlGetId = "SELECT id FROM btcounter WHERE roleCounter = 0 ORDER BY indexCounter DESC ";
            $num2 = -$gap;
            $gap = -$gap;
            while($num2--){
                if ($result = mysqli_query($conn,$sqlGetId)){
                    $row = mysqli_fetch_assoc($result);
                    array_unshift($data,$row['id']);
                    mysqli_query($conn,$sqlDelete);
                }
            }
            $sqlUpdateDad = "UPDATE btcounter SET valueCounter = valueCounter - '$gap' WHERE roleCounter=1";
            $sqlGetValueDad = "SELECT valueCounter FROM btcounter WHERE roleCounter=1";
            if (mysqli_query($conn,$sqlUpdateDad)){
                if ($result = mysqli_query($conn,$sqlGetValueDad)){
                    $row = mysqli_fetch_assoc($result);
                    $response->value = $row['valueCounter'];
                }
            }
            $response->content=$data;
            $json = json_encode($response);
            echo $json;
        }
    }
    else if (role == 0){
        $response = new StdClass();
        $response->key="UPDATE_CHILD";
        $sqlUpdateChild = "UPDATE btcounter SET valueCounter = valueCounter + '$gap' WHERE id='$id'";
		$sqlGetValueChild = "SELECT * FROM btcounter WHERE id='$id'";
		if (mysqli_query($conn,$sqlUpdateChild)){
			if ($result = mysqli_query($conn,$sqlGetValueChild)){
                $row = mysqli_fetch_assoc($result);
                $response->id=$row['id'];
				$response->value=$row['valueCounter'];
			}
        }
        $json = json_encode($response);
        echo $json;
    }
}
function delete($id, $role){
    $response = new StdClass();
    // ket noi CSDL
    $conn = mysqli_connect('localhost', 'root', '12345678', 'baitapreact1') or die ('Không thể kết nối tới database');
    $sqlDeleteRecord = " DELETE FROM btcounter WHERE id='$id' AND roleCounter='$role'";
    $sqlUpdate = "UPDATE btcounter SET valueCounter = valueCounter - 1 WHERE roleCounter = 1";
    $sqlGetValueDad = "SELECT * FROM btcounter WHERE roleCounter=1";
    $key = "CHILD_DELETE";
    $data = array();
    if (mysqli_query($conn, $sqlDeleteRecord) && mysqli_query($conn, $sqlUpdate)){
        $response->key = "DELETE_CHILD";
        if ($result = mysqli_query($conn,$sqlGetValueDad)){
            $row = mysqli_fetch_assoc($result);
            $response->id=$row['id'];
            $response->value = $row['valueCounter'];
            array_push($data, $id);
        }
        $response->content=$data;
        $json = json_encode($response);
        echo $json;
    }
}
function getData(){
    $conn = mysqli_connect('localhost', 'root', '12345678', 'baitapreact1') or die ('Không thể kết nối tới database');
    $sqlGetRecord = " SELECT * FROM btcounter";
    $resultGetRecord = mysqli_query($conn, $sqlGetRecord);
    $data = array();
    $i = 0;
    while($row = mysqli_fetch_assoc($resultGetRecord))
    {
        array_push($data, array('id' => $row['id'], 'value' => intval($row["valueCounter"]),'role'=> intval($row["roleCounter"])));
    }
    $json = json_encode($data);
    echo $json;		
}
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'PUT':
        break;
    case 'GET':
        getData();
        break;
    case 'POST':
        $body = file_get_contents('php://input');
        $data = json_decode($body);
        $id         = $data->id;
        $role       = $data->role;
        $oldValue   = $data->oldValue;
        $newValue   = $data->newValue;
        processing($id, $role, $oldValue, $newValue);
        break;
    case 'DELETE':
        if(isset($_GET["id"]))  {
            $id     = $_GET["id"];	
            $role   = $_GET["role"];		
            delete($id, $role);
        }
        break;
    default:
        break;
}
sleep(1);

mysqli_close($connect); 
?> 
