
function myApp() {
    import(/* webpackChunkName: "momentjs" */ "moment")
        .then((moment) => {
            // lazyModule tiene todos los tipos correctos, la autocompletar funciona,
            // el chequeo de tipos funciona y las referencias de código también \o/
            const time = moment().format();
            console.log("TypeScript >= 2.4.0 Dynamic Import Expression:");
            console.log(time);
        })
        .catch((err) => {
            console.log("Failed to load moment", err);
        });
}
