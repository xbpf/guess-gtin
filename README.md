which-gtin
===

Determine what GTIN format the code is, what its real format is, and if it valid or not. Supports UPC-E (number systems 0 and 1).

---

### `whichGTIN(code, upce)`: Determine which GTIN format the code is in.

* `code`: Code to check. Can be either a `string` or a `number`.
    - **warning**: Be careful using plain numbers! If you input `0123`, it will be interpreted as `"123"`. Use strings if you want to be safe.
* `upce`: Whether to check if an 8-digit code is a `UPC-E` or a `GTIN-8` code.
    - Only applies if the code given is exactly 8 digits long.
        + Even if `true`, if the code is padded with zeroes, e.g. `00000032435887`, the function will assume and validate for `GTIN-8`.
    - If the code is valid `UPC-E`, then the returned object will have the property `expanded`, which will contain the expanded `GTIN-12` string for the `UPC-E` code.

Returns an object that follows this format:

```js
{
    format: 'GTIN-14',
    real: 'GTIN-8',
    valid: true,
    expanded: null
}
```

* `format`: The given format. Determined from the code length.
    - `"GTIN-14"`, `"GTIN-13"`, `"GTIN-12"`, `"GTIN-8"`: Code is 14, 13, 12, 8 digits long, respectively.
        + `GTIN-14` = `ITF-14`
        + `GTIN-13` = `EAN` = `EAN-13`
        + `GTIN-12` = `UPC` = `UPC-A`
        + `GTIN-8` = `EAN-8`
    - `"UPC-E"`: Code is 8 digits long, and the `upce` argument is `true`.
    - `null`: Code is of an invalid format.
* `real`: The interpreted format.
    - Can be one of the `format` values.
    - If given code is `00000032435887`, the `format` is `GTIN-14`, but `real` is `GTIN-8`.
* `valid`: Whether the checksum is valid.
* `expanded`: `GTIN-12` code expanded from the given `UPC-E` code.
    - Only applies if format is 'UPC-E'.
    - **note**: The expanded `UPC-A` code can be a `GTIN-8` code. If you want to be 100% accurate, run the expanded value through the function again.


```js
import whichGTIN from 'which-gtin'

whichGTIN('00000032435887', true)
// {format: 'GTIN-14', real: 'GTIN-8', valid: true, expanded: null}

whichGTIN('123')
// {format: null, real: null, valid: false, expanded: null}

whichGTIN('32435887', false)
// {format: `GTIN-8`, real: `GTIN-8`, valid: true, expanded: null}

```
