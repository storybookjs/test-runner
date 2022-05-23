export const waitFor = async (cb: () => Promise<boolean> | boolean, timeout = 2000) => {
    return new Promise(async (resolve, reject) => {
        let finished = false;

        const timeoutError = new Error('waitFor has timed out')

        const cancelTimout = setTimeout(() => {
            finished = true;
            reject(timeoutError);
        }, timeout)

        async function retry() {
            const result = await cb()

            if(result === true) {
                finished = true;
                clearTimeout(cancelTimout)
                resolve(true)
            }

            await new Promise(resolve => { setTimeout(resolve, 100); })
        }

        function* whileGenerator() {
            while (!finished) {
                yield retry();
            }
        };



        for await(let i of whileGenerator()) {}
    })
}