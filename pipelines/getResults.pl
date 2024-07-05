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


my $lookup = {
	'Louise Heathcote'=>'Louise Petano-Heathcote',
	'Paul De Hoest'=>'Paul de Hoest',
	'Sebastian Newsam'=>'Seb Newsam',
	'Reetendra Banerji'=>'Reeten Banerji',
	'Freddie Mierlo'=>'Freddie van Mierlo',
	'Jonathan Pearce'=>'Jon Pearce',
	'William Lavin'=>'Will Lavin',
	'Nicholas Palmer'=>'Nick Palmer',
	'Mohammed Fazal'=>'Shabir Fazal',
	'Paul Charles De\'Ath'=>'Paul De\'Ath',
	'Nicholas Blunderbuss Green'=>'Nick Blunderbuss Green',
	'Mona Ishag Adam'=>'Mona Adam',
	'David Rowntree'=>'Dave Rowntree',
	'Lee James Dillon'=>'Lee Dillon',
	'Jean Misseys Blackbeard'=>'Jean Blackbeard',
	'Steve Cotten'=>'Stephen Cotten',
	'Simon Adams'=>'Si Adams',
	'Nikki Costa'=>'Nikki da Costa',
	'Andrew Dye'=>'Andy Dye',
	'Steffan Aquarone'=>'Steff Aquarone',
	'Elizabeth Dixon'=>'Liz Dixon',
	'Georgina Rowley Hill'=>'Georgina Hill',
	'Oscar Lodwick'=>'Oscar Livesey-Lodwick',
	'Andrew Meacham'=>'Andy Meacham',
	'Christopher Leggett'=>'Chris Leggett',
	'Thomas Bowell'=>'Tom Bowell',
	'Dr Courtneidge'=>'John Courtneidge',
	'Sarah Rose Barry'=>'Sarah Barry',
	'Dan Wilson'=>'Daniel Wilson',
	'Gregory Stafford'=>'Greg Stafford',
	'Giuseppe Pezzulli'=>'Bepi Pezzulli',
	'Stanley Goodin'=>'Stan Goodin',
	'Sir Leigh'=>'Edward Leigh',
	'Wing (RTD) Ramsey'=>'Fred Ramsey',
	'Liam Henry Draycott'=>'Liam Draycott',
	'Rich Kelly'=>'Richard Kelly',
	'Mohammed Hussain'=>'Shahed Hussain',
	'Theodore Roos'=>'Theo Roos',
	'Robert St O\'Carroll'=>'Robert O\'Carroll',
	'Thérèse Hirst'=>'Therese Hirst',
	'Jonathan Stewart Barras'=>'Jonathan Barras',
	'Jamie  Hinton-Wardle'=>'Jamie Hinton-Wardle',
	'Gregory Gerrard Tanner'=>'Gregory Tanner',
	'AI Steve'=>'Steve Al',
	'Farooq Siddique'=>'Farook Siddique',
	'Eric Ashwell Masters'=>'Eric Masters',
	'Alexander Richard Drury'=>'Alexander Drury',
	'Blaise Pascal Baquiche'=>'Blaise Baquiche',
	'Justine McPherson Fulford'=>'Justine Fulford',
	'Steven Lambert'=>'Steve Lambert',
	'Elizabeth Adams'=>'Liz Adams',
	'A.N.ON'=>'A.N. ON',
	'Daniel Bewley'=>'Dan Bewley',
	'Matthew Patterson'=>'Matt Patterson',
	'Cole Antony Caesar'=>'Cole Caesar',
	'John Sydney Halsall'=>'John Halsall',
	'George Mcmanus'=>'George McManus',
	'Henry Whitlock Morris'=>'Henry Morris',
	'Shazna Muzammil'=>'Shaz Muzammil',
	'Alistair Carns'=>'Al Carns',
	'Dave Radcliffe'=>'David Radcliffe',
	'James Lionel Rust'=>'James Rust',
	'Donald Mcintosh'=>'Donald McIntosh',
	'Stephen Gribbon'=>'Steve Gribbon',
	'Nick Goulding'=>'Nicholas Goulding',
	'Jessica Brown-Fuller'=>'Jess Brown-Fuller',
	'Rich McCarthy'=>'Richard McCarthy',
	'Matthew Theobald'=>'Matt Theobald',
	'Kyle Albert Marsh'=>'Kyle Marsh',
	'Timothy Prosser'=>'Tim Prosser',
	'Mike Longfellow'=>'Michael Longfellow',
	'Nicholas Fletcher'=>'Nick Fletcher',
	'David Bettney'=>'Dave Bettney',
	'Ashley Payne'=>'Ash Payne',
	'Geoff Lymer'=>'Geoffrey Lymer',
	'Chipiliro Kalebe-Nyamongo'=>'Chippie Kalebe-Nyamongo',
	'Christina Mary Coleman'=>'Christina Coleman',
	'Fesl Reza-Khan'=>'Fesl Reza Khan',
	'David Rowntree Herdson'=>'David Herdson',
	'Mel Todd'=>'Melvyn Todd',
	'Yousuf Ibrahim Bhailok'=>'Yousuf Bhailok',
	'Abdulla Dharamsi'=>'Abby Jan Dharamsi',
	'Christopher Bloore'=>'Chris Bloore',
	'David Oliver Thain'=>'David Thain',
	'Peter Ede Burch'=>'Peter Burch',
	'Arthur Pendragon'=>'King Arthur Pendragon',
	'Asa Benjamin Jones'=>'Asa Jones',
	'Michael Whale'=>'Mike Whale',
	'Gulvinder Bansal'=>'Gully Bansal',
	'Jennifer Jackson'=>'Jenny Jackson',
	'Catherine  Dobson'=>'Catherine Dobson',
	'Muryam Aminah Sheikh'=>'Muryam Sheikh',
	'Mohamed El Gadhy'=>'Mohamed El Ghady',
	'Jessica Asato'=>'Jess Asato',
	'Timothy Burt'=>'Tim Burt',
	'Isobel Campbell Doubleday'=>'Isobel Doubleday',
	'Sarah Garcia Bustos'=>'Sarah Garcia de Bustos',
	'Matt Warnes'=>'Matthew Warnes',
	'Philip Shields'=>'Phil Shields',
	'Karen Mary Seymour'=>'Karen Seymour',
	'Peter James Dean'=>'Peter Dean',
	'Jonathan Tom Davies'=>'Jonathan Davies',
	'Sorcha-Lucy Eastwood'=>'Sorcha Eastwood',
	'Ian Jr'=>'Ian Paisley',
	'Déirdre Vaughan'=>'Deirdre Vaughan',
	'Siobhán McErlean'=>'Siobhan McErlean',
	'Thomas Buchanan'=>'Tom Buchanan',
	'Dan Peña'=>'Dan Pena',
	'Stephen  Kerr'=>'Stephen Kerr',
	'Amanda Hargreaves Hampsey'=>'Amanda Hampsey',
	'Jonny Gray'=>'Johnathan Gray',
	'Caz Paul'=>'Calum Paul',
	'Udo Den Brock'=>'Udo van den Brock',
	'Jo Mowat'=>'Joanna Mowat',
	'Simon Wheeler Moorehead'=>'Simon Moorehead',
	'Chris McEleny'=>'Christopher McEleny',
	'Victor David Applegate'=>'Victor Applegate',
	'Bev England'=>'Beverley England',
	'Earl of Anglia'=>'Earl Elvis Of East Anglia',
	'James Robertson Ward'=>'James Ward',
	'Alexander Culley'=>'Alex Culley',
	'Neil Lyon Kelly'=>'Neil Kelly',
	'Robert John Francis'=>'Robert Francis',
	'Samuel Bradford'=>'Sam Bradford',
	'Janice Mackay'=>'Janice MacKay',
	'Christopher Bramall'=>'Chris Bramall',
	'Jessica Patsy Hammersley-Rich'=>'Jess Hammersley-Rich',
	'Elizabeth Stanford Wallitt'=>'Elizabeth Wallitt',
	'Sue Howarth'=>'Susan Howarth',
	'Christopher Shipley'=>'Chris Shipley',
	'Andy Banwell'=>'Andrew Banwell',
	'Frederick Keen'=>'Fred Keen',
	'Ash Routh'=>'Ashley Routh',
	'Arnie Craven'=>'Arnold Craven',
	'Damian Timson'=>'Damian Doran-Timson'
};
#getData("E14001179");
#exit;

my @arr = LoadCSV($basedir."../data/Westminster_Parliamentary_Constituencies_(Future)_Names_and_Codes_in_the_United_Kingdom_v2.csv");
for(my $a = 0; $a < @arr; $a++){
	getData($arr[$a]->{'PCON24CD'});
}

exit;
;




###########################

sub getData {
	my $id = shift;
	my $url = "https://www.bbc.co.uk/news/election/2024/uk/constituencies/".$id;
	my $savefile = $basedir."../data/bbc/$id.html";
	my $file = $basedir."../src/constituency/_data/results/$id.json";

	msg("Processing $id\n");
	my (@lines,$html,$group,$i,@scorecard,$scores,$json,$name,$found,$total,$txt);
	$json = LoadJSON($file);

	# Check if we need to download
	$total = 0;
	for($i = 0; $i < @{$json->{'votes'}}; $i++){
		if(!defined($json->{'votes'}[$i]{'votes'})){ $json->{'votes'}[$i]{'votes'} = 0; }
		$total += $json->{'votes'}[$i]{'votes'};
	}
	if($total <= 1){
		
		if(!-e $savefile){
			msg("\tDownloading <cyan>$url<none>\n");
			`curl '$url' -s -o $savefile`;
		}
		open(my $fh,"<:utf8",$savefile);
		@lines = <$fh>;
		close($fh);
		$html = join("",@lines);
		if($html =~ /window.__INITIAL_DATA__=\"(.*?)\";<\/script>/){
			$html = $1;
			$html =~ s/\\\"/\"/g;
			$html =~ s/.*"groups":(\[\{"scorecards":\[\{(.*?)\])\},"importance":"PRIMARY".*/$1/;
			$group = ParseJSON($html);
			@scorecard = @{$group->[0]{'scorecards'}};
			$scores = {};
			for($i = 0; $i < @scorecard; $i++){
				$scores->{$scorecard[$i]{'title'}} = {'party'=>$scorecard[$i]{'supertitle'},'votes'=>$scorecard[$i]{'score'}{'dataColumns'}[0][0]};
			}
		}
		$found = 0;
		for($i = 0; $i < @{$json->{'votes'}}; $i++){
			$name = $json->{'votes'}[$i]{'person_name'};
			msg("\tPerson <yellow>$name<none>\n");
			if(!$scores->{$name}){
				$name =~ s/ ([^\s]+) / /g;
				if(!$scores->{$name} && $lookup->{$name}){
					$name = $lookup->{$name};
				}
			}
			if($scores->{$name}){
				if($json->{'votes'}[$i]{'votes'}<=1){
					$json->{'votes'}[$i]{'votes'} = $scores->{$name}{'votes'};
					if($scores->{$name}{'votes'} > 0){
						$found++;
					}
					msg("\t\tUpdating vote count\n");
				}else{
					if($json->{'votes'}[$i]{'votes'}!=$scores->{$name}{'votes'}){
						warning("\t\tVotes don't match: $json->{'votes'}[$i]{'votes'} != $scores->{$name}{'votes'}\n");
					}
				}
			}else{
				error("\t\tCan't find $name\n");
				print Dumper $scores;
				exit();
			}
		}

		if($found > 0){
			$json->{'last_updated'} = strftime "%FT%R:%S.000Z", gmtime;
			$txt = JSON::XS->new->canonical(1)->pretty->space_before(0)->encode($json);
			$txt =~ s/   /  /g;
			msg("\tUpdating <cyan>$file<none>\n");
			open($fh,">:utf8",$file);		
			print $fh $txt;
			close($fh);
		}
	}
	
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


# Version 1.3
sub ParseCSV {
	my $str = shift;
	my $config = shift;
	my (@rows,@cols,@header,$r,$c,@features,$data,$key,$k,$f,$n,$n2,$compact,$sline,$col);

	$compact = $config->{'compact'};
	$sline = $config->{'startrow'}||0;
	$col = $config->{'key'};

	$n = () = $str =~ /\r\n/g;
	$n2 = () = $str =~ /\n/g;
	if($n < $n2 * 0.25){ 
		# Replace CR LF with escaped newline
		$str =~ s/\r\n/\\n/g;
	}
	@rows = split(/[\n]/,$str);

	$n = @rows;
	
	for($r = $sline; $r < @rows; $r++){
		$rows[$r] =~ s/[\n\r]//g;
		@cols = split(/,(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/,$rows[$r]);

		if($r < $sline+1){
			# Header
			if(!@header){
				for($c = 0; $c < @cols; $c++){
					$cols[$c] =~ s/(^\"|\"$)//g;
				}
				@header = @cols;
			}else{
				for($c = 0; $c < @cols; $c++){
					$header[$c] .= "\n".$cols[$c];
				}
			}
		}else{
			$data = {};
			for($c = 0; $c < @cols; $c++){
				$cols[$c] =~ s/(^\"|\"$)//g;
				$data->{$header[$c]} = $cols[$c];
			}
			push(@features,$data);
		}
	}
	if($col){
		$data = {};
		for($r = 0; $r < @features; $r++){
			$f = $features[$r]->{$col};
			if($compact){ $f =~ s/ //g; }
			$data->{$f} = $features[$r];
		}
		return $data;
	}else{
		return @features;
	}
}

sub LoadCSV {
	# version 1.3
	my $file = shift;
	my $config = shift;
	
	msg("Processing CSV from <cyan>$file<none>\n");
	open(FILE,"<:utf8",$file);
	my @lines = <FILE>;
	close(FILE);
	return ParseCSV(join("",@lines),$config);
}
