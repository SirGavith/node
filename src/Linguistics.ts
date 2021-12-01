abstract class Linguistics {
    static WordFrequency(s: string) {
        const sanitized = [...s.matchAll(/\w+/g)]

        const frequencies: { [word:string]: number } = {}

        sanitized.forEach(word => {
            const w = word[0].toLowerCase()
            if (w in frequencies) frequencies[w]++
            else frequencies[w] = 1
        })

        console.log(frequencies)

        Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]).Log()
    }
}

Linguistics.WordFrequency(`This Fire-Loving Fungus Eats Charcoal, if It Must

Some fungi sprout in fiery shades of orange and pink after wildfires, feasting on what was left behind by the burn.

Embers from the Windy fire burning in the Sequoia National Forest in California in September.
Embers from the Windy fire burning in the Sequoia National Forest in California in September.Credit...Etienne Laurent/EPA, via Shutterstock

By Ellie Shechet
Nov. 28, 2021Updated 8:57 a.m. ET

When a wildfire plows through a forest, life underground changes, too. Death comes for many microorganisms. But, like trees, some microbes are adapted to fire.

Certain fungi are known as pyrophilous, or “fire-loving.” After a fire, pyrophilous fungi “show up from nowhere, basically,” said Tom Bruns, a mycologist at the University of California, Berkeley, even in areas that haven’t burned for decades. Some sprout in fiery shades of orange and pink. “It’s a worldwide phenomenon, but we don’t really know much about them,” he said.

A new study, published last month in the journal Frontiers in Microbiology, aimed to uncover the food source that allows Pyronema, a genus of pyrophilous fungi, to appear so quickly in such big numbers after a fire. What they discovered is that the damage left by the fire itself may allow the fungi to thrive. That could affect how the ecosystem recovers, as well as how much carbon gets released into the atmosphere after wildfires.

During a severe wildfire, a lot of carbon in the top layer of soil goes into the atmosphere as carbon dioxide, while some of it stays put as charcoal, or what scientists call pyrolyzed organic matter. Slightly deeper in the soil, it’s less hot — but hot enough that any living microbes and insects exploded and died, said the study’s lead author, Monika Fischer, a postdoctoral scholar at the University of California, Berkeley.

So, is Pyronema just living off this layer of death? “Or can Pyronema actually eat charcoal?” Dr. Fischer said.

Charcoal is difficult for many organisms to break down, said Thea Whitman, an associate professor of soil ecology at the University of Wisconsin-Madison and Dr. Fischer’s co-author. But, she said, “there are certain microbes that can decompose it.”
Image
Pyronema and moss on a soil aggregate collected by Monika Fischer.
Pyronema and moss on a soil aggregate collected by Monika Fischer.Credit...Monika Fischer

To find out if Pyronema can eat charcoal, the authors grew the fungus from samples collected by Dr. Bruns’s team after the Rim fire in California in 2013. The Pyronema lived on charcoal, as well as three other nutrient sources for comparison. Then they dunked the fungus in liquid nitrogen and sent it off for RNA sequencing.

“If it’s trying to eat the charcoal, we would see a bunch of metabolic genes getting turned on — which is what we saw,” Dr. Fischer said. And many were genes involved in breaking down the complex ring structures that make up charcoal.

To confirm that the fungus was actually doing what it appeared to be doing, Dr. Whitman’s lab grew pine seedlings in an atmosphere with carbon dioxide containing carbon-13, an isotope whose unusual weight makes it easy to trace, and then put the trees in a specialized furnace to form charcoal, which was fed to the Pyronema. Like us, fungi take in oxygen and expel carbon dioxide, most of which comes from whatever they are eating. The fungus’s carbon-13-labeled emissions, then, suggested that it really was snacking on charcoal.

The researchers also tracked normal carbon dioxide coming out of the fungus, and substantially more of it than the charcoal, suggesting it was eating something else — maybe the agar it was growing on, or some carbon that entered during inoculation, Dr. Whitman said.

Dr. Fischer offered this interpretation: “Pyronema can eat charcoal, but it really doesn’t like to.” The fungi may first enjoy that layer of dead organisms, the authors suggested, and then switch to charcoal when it must.

“Fungi are amazing at degrading all sorts of compounds,” said Kathleen Treseder, an ecologist at the University of California, Irvine, who was not involved in the study. “It makes sense that they would be able to break down this pyrolyzed material.” Aditi Sengupta, a soil microbial ecologist at California Lutheran University who also was not involved, added that it would be useful to confirm the experiment outside the lab and in the wild.

If this fungus is breaking down charcoal after a fire, Dr. Fischer said — even a little bit of it — then that could help open up a food source for the next generation of microbes and other creatures that can’t eat charcoal, making Pyronema an important player in post-fire recovery. And if Pyronema can do it, she said, maybe other fungi can, too.

“We want these kinds of activities in the soil,” Dr. Sengupta said. At the same time, she pointed out that “eventually that might lead to us losing the carbon in the soil.” As climate change and other human actions drive more frequent and intense wildfires, we need to understand whether carbon stored in the ground as charcoal will stay there, Dr. Treseder said, “or if that’s not something we can really count on, because the fungus can degrade it and release it as CO2.”`)