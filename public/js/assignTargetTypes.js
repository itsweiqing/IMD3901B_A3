function assignTargetTypes() {
    // Now using primitive types instead of colors
    var types = ["box", "sphere", "cylinder", "cone"];
    // Shuffle the types array
    types.sort(() => Math.random() - 0.5);
    let player1Type = types[0];
    let player2Type = types[1];
    return [player1Type, player2Type];
}