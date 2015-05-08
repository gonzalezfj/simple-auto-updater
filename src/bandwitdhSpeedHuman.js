function toHuman(bits_rate) {
   var ordinals =  ["","K","M","G","T","P","E"];
   var ordinal = 0;
   
   while(bits_rate > 1024)
   {
      bits_rate /= 1024;
      ordinal++;
   }
   bits_rate = Math.round(bits_rate * 100) / 100;
   var ord = ordinals[ordinal];
   return (bits_rate + " "+ ord+  "b/s");
}
module.exports.toHuman = toHuman;