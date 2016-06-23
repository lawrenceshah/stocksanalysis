<?php
	$post = json_decode(file_get_contents("php://input"));
	$a = $post->fromMonth;
	$b = $post->fromDay;
	$c = $post->fromYear;
	$d = $post->toMonth;
	$e = $post->toDay;
	$f = $post->toYear;
	$lines = file("http://ichart.finance.yahoo.com/table.csv?s=".$post->symbol."&a=".$a."&b=".$b."&c=".$c."&d=".$d."&e=".$e."&f=".$f);
	echo(json_encode($lines));
?>
