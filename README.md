# (unofficial?) IOTA Flash Library

===

## Introduction

WIP

## Under the hood

In this implementation of the Flash JS-library, every action happens within a single class: `Flash`. The instance of `Flash` holds your flash state (current addresses from the tree, list of users, etc).

You construct the class by supplying an username and a working instance of `IOTA`. See example.html for more info.

The username is being linked to an index (always 0 for the first user). The user with index 0 will always complete the signatures (for now) (receives the digests, creates final address, which will be pushed out to others).

New users being added will get an higher index. While it would be possible to address users in the channel by their index, an username is preferred, since then we can receive data out of order, and still sign within order (for multisig order has to be preserved). For example: if there is a room with 3 people, and first user 3 comes in with their digest, then 2, user 1 could just wait until all digests from the other 2 are in, and then just map the usernames to their index loop over the digests in a sorted manner.

### Protocol-agnostic

Since Flash channels occur between 2 or more different devices, it's crucial not to rely on a single data transfer protocol. This is why all functions that change the state of the flash-channel (think of making transactions or addresses) will return an instance of `Command`.

Commands are basically instructions to change the state of the flash channel. They are atomic, light, and easy to validate.

Let's take an example:

```
var iota = new IOTA({
  provider: "http://52.58.212.188:14700"
})
var flash1 = new Flash(iota, "The_PeterNat0r")
var initializeCmd = flash1.initialize(seed1, 5, 100, "SETTLEMENT99", 2)
```

Returns:

`initialize|{"pending":{"addressesToCosign":{"The_PeterNat0r":[{"depth":0,"index":0,"trytes":"ZGMSYTSBE9P9DPPURUQPCYAVXJPBMRSFTOHZTDMNIURFGHUWFGOBMGZSUOSOWMQBMVJPPOJXD9VQCFSEBWCIUXCXQTIBRRNMDPURBLXVHGZTRBXMFLVDUPBLVJKDZFPNYWSUABYEHUEPSASFFRORVUNVPYXOT9CTWX"},{"depth":1,"index":1,"trytes":"YADHNAFKDSMHETEIXNUQDMJGALNNIURNTVQINLQUBNAIQGADOUBTRBFGPJWNVLHTIS9XUOJXAZ9NGDBSZ9DYBMH9XWBEELNQVHXINACFAYCIPSUKWINYQFUWIYPGZLJFMZVOSXYJUNCMBMARZCXDJBDFYHYNPGRMWX"},{"depth":2,"index":2,"trytes":"RFXXGJHLNYOVB9BAQNUOUYQDGCHCLQG9ZROGQKXVXWTBFVFHKTTYFOAGXZCGYVDCPLQMCAXXPLNWUUMBWQJRJPFMEBJKFIH9NTOW9VHEPHKBPHDINGXNYDLHCBWKJREDNDRKRMMNVAVCBJMKTPKWEOLTALWCYBXTFA"},{"depth":3,"index":3,"trytes":"SKJISFYIHGACCYCOJOQLRR9OROSIEXJDTYEO9EYOLTSYTQFTDM9HXSGXGXNVZTZVTFPGFTIVHDIPYCJEDYRHYCAHMBHKWMZHLTIK9XNAGFYIXCMNHWICHBD9OJPRQECCLGJLHPTYKRXX9BVYRJGJZKLBZBNWLZJIDY"},{"depth":4,"index":4,"trytes":"WDWDBQVVZKGAITRLNTQGLDMTXL9JJQKLXFZFDSCL9XLIHLOYJWNGRUSCPITFZSNHCRUDTDMAUDFHCCEJ9ZXJQTWVTSMZEODUTKENOKBJLJSAXLZQRQ9CSPBEWZOOBCWXTCDHWQGOHIKUZISMWJIAZEHGFJIKA9PZMZ"},{"depth":5,"index":5,"trytes":"ZYENUEZNOFEDLLEJFR9HYZHDFBLQWILLIWCKRRG9QL9OQZPVADJNAILRTKVTWHHXNYVXYZEUKWAE9FIGZXNWSHYWEWFHDVIPOWQQZDTQUTVLKNOQRNYOIYDVMNRCEKIAFXCXXI9XBGEVWEQIGQBJSHVCFHAJUT9PBD"}]}},"users":{"The_PeterNat0r":{"index":0,"balance":0,"stake":0,"settlementAddress":"SETTLEMENT99","securityLevel":2}},"publicLedger":{"depth":5,"remainderAddress":null,"depositAmount":100,"addressIndex":0}}`

Right now, most commands are JSON objects, but in the future they are going to be lighter than that. This is also to allow Flash to run even better on smaller devices, but also to make it easier to implement (de)serialization on small, embedded systems.

What is even more interesting, is that functions in the library returning an instance of `Command` are **guaranteed** to never change the state.

If you want your action to persist, you have to call `executeSelf`, like this: `var initializeCmd = flash1.initialize(seed1, 5, 100, "SETTLEMENT99", 2).executeSelf()`

This is a really good thing, since we use the same commands both locally as well as remote when sending them. This way, there is a guarantee that said command will run exactly the same on both ends of the network.
