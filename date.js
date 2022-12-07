
exports.getDate = function(){
    const Date1 = new Date();
    const currentDate = Date1.getDay();
    const option = {
        weekday:"long",
        day: "numeric",
        month:"long"
    };
    return Date1.toLocaleDateString("hi-IN",option);
}

exports.getDay = function(){
    const Date1 = new Date();
    const currentDate = Date1.getDay();
    const option = {
        weekday:"long",
    };
    return Date1.toLocaleDateString("hi-IN",option);
};