#!/usr/bin/perl

use utf8;
use warnings;
use strict;
use JSON::XS;
use Data::Dumper;
use Cwd qw(abs_path);
use POSIX qw(strftime);
use MIME::Base64 qw(encode_base64);
binmode STDOUT, 'utf8';
binmode STDERR, 'utf8';

# Get the real base directory for this script
my ($basedir, $path);
BEGIN { ($basedir, $path) = abs_path($0) =~ m{(.*/)?([^/]+)$}; push @INC, $basedir; }


my $ddir = $basedir."../src/constituency/_data/results/";
my $odir = $basedir."../src/assets/img/thumbnails/";
my $rdir = $odir."raw/";
my $ojson = $basedir."../data/thumbnails.json";

my($dh,$filename,$json,$v,$ofile,$thumb,$pid,$db,$progress,$total,$thumbs,$i,$ext);

# Create directory if it doesn't exist
if(!-d $odir){ `mkdir $odir`; }
if(!-d $rdir){ `mkdir $rdir`; }

opendir($dh,$ddir);
$total = 0;
msg("Reading JSON files from <cyan>$ddir<none>\n");
while( ($filename = readdir($dh))) {
	if($filename =~ /\.json$/){
		$json = LoadJSON($ddir.$filename);
		for($v = 0; $v < @{$json->{'votes'}}; $v++){
			if($json->{'votes'}[$v]{'image'} !~ /missing\.svg/){
				$thumbs->{$json->{'votes'}[$v]{'person_id'}} = $json->{'votes'}[$v]{'image'};
				$total++;
			}
		}
	}
}
closedir($dh);

msg("<green>$total<none> profile images to process.\n");

$db = {};
$i = 0;
foreach $pid (sort{$a <=> $b}(keys(%{$thumbs}))){
	$thumb = processProfile($pid,$thumbs->{$pid});
	$db->{$pid} = "data:image/webp;base64,".get64($thumb);
	
	if($i%100==0){
		SaveJSON($ojson,0,$db);
	}
	$i++;
}




##########################
# SUB ROUTINES
sub processProfile {
	my $pid = shift;
	my $url = shift;
	my ($ext,$ofile,$thumb,$get);
	$url =~ /(\.[^\.]+)$/;
	$ext = $1;
	$ofile = $rdir.$pid.$ext;
	$thumb = $odir.$pid.".webp";
	msg("Process profile <yellow>$pid<none>\n");
	if($url !~ /missing\.svg/){
		$get = (-e $ofile) ? 0 : 1;
		if($get){
			msg("\tGet from <cyan>$url<none>.\n");
			getImage($url,$ofile);
		}
		if(!-e $thumb){
			msg("\tMake thumbnail.\n");
			makeThumbnail($ofile,$thumb);
		}
		if($get){
			sleep(2);
		}
	}else{
		msg("\tMissing = $url\n");
	}
	return $thumb;
}

sub getImage {
	my $url = shift;
	my $file = shift;
	if(!-e $file){
		`curl '$url' -s -o $file`;
	}
}

sub makeThumbnail {
	my ($file,$thumb,$size) = @_;
	my ($filename,$filetype,$args,$f);
	$f = $file;
	if(!defined($size)){ $size = "80"; }
	if(-e $thumb){
		return;
	}

	if($file =~ /^(.*)\.(jpg|jpeg|png|svg|gif)$/i){
		$filename = $1;
		$filetype = lc($2);
		if(!-e $thumb){
			$args = "";
			if($filetype eq "svg"){
				$args = "-density 200 -background none \"$file\" -auto-orient -thumbnail ".$size."x".$size."^ -gravity center -extent ".$size."x".$size." -background transparent";
			}elsif($filetype eq "gif"){
				$args = "$file\[0\] -auto-orient -thumbnail ".$size."x".$size."^ -gravity center -extent ".$size."x".$size."";
			}else{
				$args = "\"$file\" -auto-orient -thumbnail ".$size."x".$size."^ -gravity center -extent ".$size."x".$size." -background transparent";
			}
			$args .= " -quality 90  -strip";
			if(-e $file){
				`convert $args \"$thumb\"`;
			}else{
				warning("Input file <cyan>$file<none> doesn't exist to make thumbnail\n");
			}
		}else{
			# The thumbnail seems to exist but it isn't included in the DB
			#warning("The thumbnail already exists.\n");
		}
	}else{
		error("<cyan>$file<none> is not an acceptable image type so can't create a thumbnail.\n");
	}

	return "";
}

sub get64 {
	my $file = shift;
	my ($fh,$buf,$str);
	open($fh, $file) or die "$!";
	$str = "";
	while (read($fh, $buf, 60*57)) {
		$str .= encode_base64($buf);
	}
	close($fh);
	$str =~ s/[\n\r]//g;
	return $str;
}

sub msg {
	my $str = $_[0];
	my $dest = $_[1]||"STDOUT";
	
	my %colours = (
		'black'=>"\033[0;30m",
		'red'=>"\033[0;31m",
		'green'=>"\033[0;32m",
		'yellow'=>"\033[0;33m",
		'blue'=>"\033[0;34m",
		'magenta'=>"\033[0;35m",
		'cyan'=>"\033[0;36m",
		'white'=>"\033[0;37m",
		'none'=>"\033[0m"
	);
	foreach my $c (keys(%colours)){ $str =~ s/\< ?$c ?\>/$colours{$c}/g; }
	if($dest eq "STDERR"){
		print STDERR $str;
	}else{
		print STDOUT $str;
	}
}

sub error {
	my $str = $_[0];
	$str =~ s/(^[\t\s]*)/$1<red>ERROR:<none> /;
	msg($str,"STDERR");
}

sub warning {
	my $str = $_[0];
	$str =~ s/(^[\t\s]*)/$1<yellow>WARNING:<none> /;
	msg($str,"STDERR");
}

sub ParseJSON {
	my $str = shift;
	my ($json);
	eval {
		$json = JSON::XS->new->decode($str);
	};
	if($@){ error("\tInvalid output in input: \"".substr($str,0,100)."...\".\n"); $json = {}; }
	return $json;
}

sub LoadJSON {
	my (@files,$str,@lines,$json);
	my $file = $_[0];
	open(FILE,"<:utf8",$file) || error("Unable to load <cyan>$file<none>.");
	@lines = <FILE>;
	close(FILE);
	$str = (join("",@lines));
	return ParseJSON($str);
}

sub SaveJSON {
	
	my $file = shift;
	my $compact = shift;
	my $json = shift;
	my ($i);

	my ($fh,$txt);
	open($fh,">:utf8",$file);
	print $fh "\{\n";
	$txt = "";
	foreach $pid (sort{$a <=> $b}(keys(%{$json}))){
		$txt .= ($txt ? ",\n":"")."\t\"$pid\":\"$json->{$pid}\"";
	}
	print $fh $txt;
	print $fh "\n}\n";
	close($fh);
}
