const fetcher = (...args) =>
    fetch(...args).then((res) =>
        res.ok
            ? res.json()
            : Promise.reject({
                  status: res.status,
                  statusText: res.statusText,
              }),
    );

export default fetcher;
