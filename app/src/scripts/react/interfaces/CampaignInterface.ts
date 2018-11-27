interface Campaign {
    _id: string,
    users: string[],
    characters: string[],
    name: string,
    gm: string // User._id of the GM
}

export default Campaign;