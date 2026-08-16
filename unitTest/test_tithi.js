var fs = require('fs');
eval(fs.readFileSync(__dirname + '/../src/panchang.js', 'utf8'));

function runTest(dateInput) {
  var d = (typeof dateInput === 'string') ? new Date(dateInput) : new Date(dateInput);
  panchang.calculate(d);
  var s = panchang.Tithi.start;
  var e = panchang.Tithi.end;
  if (! (s instanceof Date) || ! (e instanceof Date)) throw new Error('Tithi start/end not Date objects');
  var diffDays = (e - s) / (1000 * 60 * 60 * 24);
  if (!(diffDays > 0 && diffDays < 3)) {
    throw new Error('Unexpected tithi length for ' + d.toISOString() + ': ' + diffDays + ' days (start=' + s.toISOString() + ', end=' + e.toISOString() + ')');
  }
  console.log('PASS', d.toISOString(), 'tithi name:', panchang.Tithi.name, 'length (days):', diffDays.toFixed(3));
}

try {
  runTest('2020-04-23T00:00:00Z');
  runTest('2020-05-22T00:00:00Z');
  // current date/time test
  var now = new Date();
  panchang.calculate(now);
  var sNow = panchang.Tithi.start;
  var eNow = panchang.Tithi.end;
  if (! (sNow instanceof Date) || ! (eNow instanceof Date)) throw new Error('Tithi start/end not Date objects for current date');
  if (!(now >= sNow && now < eNow)) {
    throw new Error('Current time is not inside computed tithi interval: now=' + now.toISOString() + ', tithi=' + panchang.Tithi.name + ', start=' + sNow.toISOString() + ', end=' + eNow.toISOString());
  }
  console.log('PASS current date', now.toISOString(), 'tithi:', panchang.Tithi.name, 'start=' + sNow.toISOString(), 'end=' + eNow.toISOString());
  console.log('All tests passed');
  process.exitCode = 0;
} catch (err) {
  console.error('TEST FAILED:', err.message);
  console.error(err.stack);
  process.exitCode = 1;
}
