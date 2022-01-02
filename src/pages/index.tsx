import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import type React from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import Image from "next/image";
import Link from "next/link";

const btn =
  "inline-flex items-center px-2.5 py1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

  const voteMutation = trpc.useMutation(["cast-vote"]);


  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }

    updateIds(getOptionsForVote());
  };
  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  // const dataLoaded = false;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center relative">
      <div className="text-2xl text-center pt-8">Which pokemon is rounder?</div>

      {dataLoaded && (
        <>
          <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
            <PokemonListing
              pokemon={firstPokemon.data}
              vote={() => voteForRoundest(second)}
            />
            <div className="p-8">Vs</div>
            <PokemonListing
              pokemon={secondPokemon.data}
              vote={() => voteForRoundest(second)}
            />
            <div className="p-2" />
          </div>
        </>
      )}

      {!dataLoaded && <img src="/rings.svg" />}
      <div className="w-full text-xl text-center pb-2">
        <a href="https://github.com/chocsx/roundest-mon">github</a> {" | "}
        <Link href="/results">Results</Link>
      </div>
    </div>
  );
}

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={props.pokemon.spriteUrl}
        width={256}
        height={256}
        layout="fixed"
        alt="Pokemon"
      />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};
