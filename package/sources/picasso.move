module package::picasso;

use std::string::String;
use sui::clock::Clock;
use sui::display;
use sui::package::claim;

//OTW
public struct PICASSO has drop {}

public struct PicassoNFT has key, store {
    id: UID,
    image_url: String,
    date: u64,
    location: String,
}

public struct MintCap has key, store {
    id: UID,
}

fun init(otw: PICASSO, ctx: &mut TxContext) {
    let cap = MintCap { id: object::new(ctx) };
    let publisher = claim<PICASSO>(otw, ctx);

    let mut disp = display::new<PicassoNFT>(&publisher, ctx);
    disp.add(b"image_url".to_string(), b"{image_url}".to_string());
    disp.add(b"creator".to_string(), b"ArtToo".to_string());
    disp.add(b"description".to_string(), b"A commemorative NFT from Sui BuilderHouse Singapore September 2024".to_string());

    disp.update_version();

    let sender = ctx.sender();
    transfer::public_transfer(cap, sender);
    transfer::public_transfer(publisher, sender);
    transfer::public_transfer(disp, sender);
}


public fun mint(_: &MintCap, image_url: String, clock: &Clock, ctx: &mut TxContext): PicassoNFT {
    PicassoNFT {
        id: object::new(ctx),
        image_url,
        date: clock.timestamp_ms(),
        location: b"Singapore Sui Builder House".to_string()
    }
}
