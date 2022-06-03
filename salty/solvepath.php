<?php
define ('PWLEN', 4);
define ('PASSWORD', 'bca4');
#define ('PASSWORD', 'aaaab');
define ('SALT', 'NaCl2');
define ('DEBUG', 0);
/*
 * Generate md5 hashes of the candidate password + salt until the hash equals targetHash
 * Then report the candidate password that generated the has 'target password'
 * Support arbitrary length passwords
 * Array indices[] contains the index of each character of the candidate password.
 * The candidate password is formed by taking the index[0]'th characgter of the pwCharset for character 0,
 *  then the index[1]'t char of pwCharset for character 2, etc.
 * When we increment the candidate password, we increment index[0] mod charsetSize. If digit [0] overflows, we increment digit [1],
 *  If digit[1] overflows, increment digit[2], etc.
 * When digit PWLEN turns from 0 to 1, we know we have iterated over all combinations of PWLEN digits of the candidate passwords.
 * Testing this way means we don't have to check each entry in indices[] for done-ness each time through the loop. saves a few steps.
 */

// Operates on array indices and advances to the next valid combination
function incrementIndices(&$indices, $arraySize, $charsetSize){
    if (DEBUG) printf ("incrementIndices(%s, %d, %d)\n", implode(",",$indices), $arraySize, $charsetSize);

    // always increment the first digit
    $i=0;
    $new = ($indices[$i] + 1) % $charsetSize;
    $carry = ($new == 0) ? 1 : 0;
    if (DEBUG) printf ("New = indices[%d]=%d + 1 + %d mod %d = %d\n", $i, $indices[$i], $carry, $charsetSize, $new);
    $indices[$i] = $new;
    $i++;

    while ($i < $arraySize && $carry != 0){
        $new = ($indices[$i] + $carry) % $charsetSize;
        $carry = ($new == 0) ? 1 : 0;
        if (DEBUG) printf ("New = indices[%d]=%d + %d mod %d = %d\n", $i, $indices[$i], $carry, $charsetSize, $new);
        $indices[$i] = $new;
        $i++;
    }
}
// print for debugging
function printIndices($indices, $arraySize){
    for ($i = 0; $i < $arraySize; $i++){
        printf ("%d", $indices[$i]);
    }
    printf ("\n");
}
// form a new candidate password based on the values in indices
function updateCandPW($indices, &$candPW, $pwCharset){
    for($i=0; $i < PWLEN; $i++){
        $candPW[$i] = $pwCharset[$indices[$i]];
    }
}
// for test, we know the password
// in reality, we will only know the targetHash
$targetHash = md5(PASSWORD.SALT);

// keep track of when the program starts so we can report elapsed time
$startTime = microtime(true);
// characters that can be used in forming a password
$pwCharset = "abcdefghijklmnopqrstuvwxyz0123456789";
$charsetSize=strlen($pwCharset);

printf ("Examining all combinations of %d characters from the candidate character set:\n(%s)\nhashed with md5 with a salt of (%s) to see if any key results in a hash that matches %s.\nThis could take a while. Use 'nohup (command) &' to prevent the job from stopping if your terminal logs out or you lose your connection to the server.\n", PWLEN, $pwCharset, SALT, $targetHash);

// milestone is 1% of the worst-case count, we report progress every milestone number of steps
printf ("There are %s possible cases.\n", number_format(($charsetSize ** PWLEN), 0, '.', ','));
$milestone = (int) (($charsetSize ** PWLEN) / 100);
if ($milestone > 1000000) $milestone = 1000000;
// show subMilestones if the milestones are too far apart
if ($milestone > 1000) $subMilestone = ($milestone / 100); else $subMilestone=0;
printf ("Reporting progress every %s steps",
    number_format($milestone, 0, '.', ','));
if ($subMilestone != 0){
    printf ("and a dot every %s steps.\n", number_format($subMilestone, 0, '.', ','));
} else {
    printf ("\n");
}

if (DEBUG) printf ("base:%s, charset:%s, csSize:%d salt:%s\n", PASSWORD, $pwCharset, $charsetSize, SALT);

// set up indices[] with 0,0,0,...
// Preload candPW while we're at it
for($i=0; $i < PWLEN; $i++){
    $indices[$i] = 0;
    $candPW[$i] = $pwCharset[$indices[$i]];
}
// indices has one more digit than candPW, so we can detect the final overflow if we try all combinations
$indices[PWLEN] = 0;

// iterate over all combinations of indices[] until we overflow
$step = 0;
while ($indices[PWLEN] == 0){
    if (DEBUG) printf ("md5(cand=%s . SALT)=%s eq? targetHash;%s\n", implode("",$candPW), md5(implode("",$candPW)), $targetHash);
    // test if our candidate password matches the target
    if (md5(implode("",$candPW).SALT) == $targetHash ){
        printf ("\nFound password %s with salt %s equals targetHash hash(%s). Victory after %d tests!\n", implode("",$candPW), SALT, $targetHash, $step);
        break;
    }

    // if not, increment the index
    incrementIndices($indices, PWLEN+1, $charsetSize);
    if (DEBUG) printIndices($indices, PWLEN+1);
    // update the candidate password based on the new index
    updateCandPW($indices, $candPW, $pwCharset);
    if (DEBUG) printf ("CandPW:%s\n", implode("", $candPW));
    // count steps so we can report progress
    $step++;
    // print mmilestones to let the user know we're still running
    if ($subMilestone != 0 && $step % $subMilestone == 0){
        printf(".");
        flush(); // force output of the dot immediately, in case things are going slowly
    }
    if ($step % $milestone == 0){
        printf("[Checked %s cases]\n", number_format($step, 0, '.', ','));
    }
}
printf ("\n");
$elTime = microtime(true) - $startTime;
printf ("Elapsed time: %f sec.\n", $elTime);

