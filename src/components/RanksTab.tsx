import React, { useState } from 'react';
import { LeaderboardEntry, UserStats } from '../types';

interface RanksTabProps {
  stats: UserStats;
}

export default function RanksTab({ stats }: RanksTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Static rankings matching requested html image states
  const baseRankings: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Emma Ema',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK7mK8vkxf8KtQ0FwhNovOdBSFBSr37Ubiy2ovRFo_n94v41sc4Lc_2AsLeRQ8a4ERzdZh4mbzMKVcDZ5jenbyQsopWoL1GBxspEsFvtUwxaB7r0g8o1iy4P-e-c1n_CPCDgy7kDd86-_aPiyabbULUWvOEUslualR-dPT7FPk83KlJTcW2Ol3FJv5dBEy86YtL7p6RZO0elkWPu-2GWzIww2cCYWXe3Jocpwx-VPhMoopX61zV7EJfEuAXRGbB6x4krb5C72Wy7s',
      diamonds: 1120,
    },
    {
      rank: 2,
      name: 'Sophia Cba',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfya1JIZVF9_ZuIdT78cnlpRnt0ceyR9zulAfjbX1ubG2ia369xjbQLtREb75UTHJ28eEuOHx_0r-NVlCRIyWNCAof7qOH8hDmofRgjV7VNzBvb0hpIjcH26PgWEGddM48w-NsJvKSjyqsLxVg6g6oojqEB5BnD5ssVJ3Sf7Dv5iBbBZO95twEbjqEJ74Nn7LcUFbsv2gI8faXaNdf_jfo5zTwFEgMuoKf89u-LgmUPYj0gI_BdlAVGJUzBzf6BogBHZwFYFgdht4',
      diamonds: 950,
    },
    {
      rank: 3,
      name: 'Andrew W',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPJ3HKXK_pIlQ5FMQbWj16oTSZxvHQeIbFk4reCNCHddYYi_cI9RlEWFP6Mgutq5Jf7pKD3CmqeZrdYTa0E3RvbE-gJv9m9e-IH8hOOYoeUAaWujaHiB-nHOAqa0Jl4ufI4nXqc84F4LQJxhuGCm_KZKq-FVRmtFtWcaydd4ecYjqgU7ky1Fm8kLnZlcW4_sHRx55BktNiD_5F8hsk8d8BBmoIU-IdtOpMd7vJx8adDwUHGA81_k2wCnOGhdVuW8rvOjMTDIoAieU',
      diamonds: 890,
    },
    {
      rank: 4,
      name: 'Bayu aji sadewa (You)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIOXy9cHYQZkuvXne9VCqqmAzZcLLwXWc7Nzs1i1VqBIdw3VF0L4rI6tdYNLL4zJL2VVn0cBk--VzRvasWhSxV_e6_J2PdmvdoPbU6ImE2KjMjTr6N7IaNyI5GL3z1J4txZpJLrhGRfm8iJY6c5UNWin6g87v56AlrI--TH4kC5-iwFjYo7w57j44hBIMsqDT4Pu3qOuilB_-9vkuyiBmAithvnsICKSg7RGwQspmiGmIkDoPs7zKE7VYWuHq55oJB6Adsr-enz_M',
      diamonds: stats.diamonds, // Linked dynamically to track user progress!
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: 'Olivia Ava',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWWbhBohVaf77DeC-ZO3Cj9RL80OZ36bIe6BSHp5Xh6x6FrPHm5fxbRSNZeOsCavrhL5ii-X-529gOMpbW6lGeYOze5TGSXyKLjGmG8FGmEM5NmAKBjOWPQygnBj-Tnk067CLx6keCTR0DKnS1yTRwCUXiYrBjUhCsfv5qRA62iaKYErz7cpWEv6a7lz6bvUZPdm1A21pmbo_0LAQ1wms4avZxlG56AzgjuY-pYOAkbs5AS15oa-uKm49p0VzTwdpY8zS3ZP_rMsk',
      diamonds: 810,
    },
    {
      rank: 6,
      name: 'David Joshua',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX53EOrMCd8buNrjRTxOUfrvPaTrbMKrbptaezdL7vbnf0JcXal8kM14GPMvRK14DieKWCULgcCqInhqCSVTw8wcqVf-aBnsxEteUJ6B1F1_KeU3PXBQsW8Cmh041EO6q-uALRNYKvZbJjXXmBp1aNI1EPjx9L6JjBjYglsVgQFNImMS6CSQ03NRzwTSyTAICZc76jVn9t12Qa_Asf6MNhqz_Nac9L-U-TbyvqtpHBp27bpnla6tM67MCPaKQ06PTFBFO53wOON80',
      diamonds: 780,
    },
    {
      rank: 7,
      name: 'Charlotte Harper',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAW6vcJ4FaZQiesshR04M67-ItOSIOXVreETANMOAMHjZQ_h2QeZm1uy4eQemPlI8nkG_4JqN7Qv3WmJFe_ZH5R9Iq1FqenbquTPNgz9dLfZjHFA_eSiG-JKyrWHdk1aqi781v0TNhXc5YpwCQIOHcKuGuvLvT0Wp_sFyau_3WbpXQewOdZv2sj_5H1C85ZrjBFqwZ38Q1z6UF7Ir0mNBahguF7MMgLKIjv_Ohm30VmQ9g9RZS4szj7ar5ErCsrpwkp_VFItxfjPU',
      diamonds: 720,
    },
    {
      rank: 8,
      name: 'Mia Evelyn',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm_sYDO649h8cdYb81vkNRp2Mm1MfGQamQAnR2JQwxq3PbeW1EjZQoyhXIY-x9Sh3LEQHm3W4mlrVNHSo0Topj1Vgi4ayCSXQkW0XRmcJGDTNvHbXL131NB2xiLue-CHCW6MnxjMx-3I_iSEOxhZ5V6mbGuK6Y-2krPTG9ZQ5k9oycedNDjNkGmRli3vnFdH81oK6ZEa_AhUhbhKH_EDDOZNlDgeriAZ9qPjTySbbFhu8Yo2LMLTkhZiqGhMiYs_bdn9MtrlkCqto',
      diamonds: 690,
    }
  ];

  // Dynamic sorting in case currentUser surpasses Andrew W / Sophia etc!
  const sortedRankings = [...baseRankings].sort((a, b) => b.diamonds - a.diamonds);
  
  // Re-map ranks after sort
  const remappedRankings = sortedRankings.map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));

  // Top 3 for podium
  const rank1 = remappedRankings.find(r => r.rank === 1);
  const rank2 = remappedRankings.find(r => r.rank === 2);
  const rank3 = remappedRankings.find(r => r.rank === 3);

  // Remaining for listing
  const listPlayers = remappedRankings.filter(r => r.rank > 3);

  // Filter list by search query
  const filteredList = listPlayers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full pb-24 pt-4 px-4 max-w-lg md:max-w-2xl mx-auto space-y-8 select-none">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-black text-2xl md:text-3xl uppercase italic tracking-tighter">Leaderboard</h2>
          <span className="material-symbols-outlined text-[#b71422] text-3xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_fire_department
          </span>
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <input 
            type="text"
            placeholder="Search summoners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-60 h-10 pl-9 pr-4 bg-white border-2 border-[#1c1c18] rounded-xl font-sans font-semibold text-xs focus:ring-[#b71422] focus:border-[#b71422]"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-sm text-[#5c5c5c]">search</span>
        </div>
      </div>

      {/* Podium Section */}
      <div className="flex items-end justify-center gap-2 md:gap-4 mb-16 h-48 relative">
        {/* Rank 2 Podium */}
        {rank2 && (
          <div className="flex flex-col items-center w-1/3">
            <div className="relative mb-2">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[#c6c6c6] overflow-hidden hard-shadow-sm bg-white">
                <img alt={rank2.name} className="w-full h-full object-cover" src={rank2.avatar} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#5c5c5c] text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#1c1c18] font-display font-bold text-xs">2</div>
            </div>
            <div className="text-center">
              <p className="font-sans font-extrabold text-[#1c1c18] text-xs truncate w-24 mx-auto">{rank2.name}</p>
              <p className="font-sans font-bold text-[#5c5c5c] text-[10px]">{rank2.diamonds} Diamonds</p>
            </div>
          </div>
        )}

        {/* Rank 1 Podium */}
        {rank1 && (
          <div className="flex flex-col items-center w-1/3 -mt-6">
            <div className="relative mb-2 shrink-0">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <span className="material-symbols-outlined text-[#fcd400] text-3xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                  emoji_events
                </span>
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#fcd400] overflow-hidden hard-shadow bg-white">
                <img alt={rank1.name} className="w-full h-full object-cover" src={rank1.avatar} />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-[#fcd400] text-black w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#1c1c18] font-display font-black text-sm">1</div>
            </div>
            <div className="text-center">
              <p className="font-sans font-extrabold text-[#1c1c18] text-xs truncate w-24 mx-auto">{rank1.name}</p>
              <p className="font-sans font-bold text-[#b71422] text-[10px]">{rank1.diamonds} Diamonds</p>
            </div>
          </div>
        )}

        {/* Rank 3 Podium */}
        {rank3 && (
          <div className="flex flex-col items-center w-1/3">
            <div className="relative mb-2">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[#930014] overflow-hidden hard-shadow-sm bg-white">
                <img alt={rank3.name} className="w-full h-full object-cover" src={rank3.avatar} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#474747] text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#1c1c18] font-display font-bold text-xs">3</div>
            </div>
            <div className="text-center">
              <p className="font-sans font-extrabold text-[#1c1c18] text-xs truncate w-24 mx-auto">{rank3.name}</p>
              <p className="font-sans font-bold text-[#5c5c5c] text-[10px]">{rank3.diamonds} Diamonds</p>
            </div>
          </div>
        )}
      </div>

      {/* Ranking List */}
      <div className="space-y-3">
        {filteredList.map((player) => (
          <div 
            key={player.rank}
            className={`rounded-2xl border-2 border-[#1c1c18] p-3.5 flex items-center gap-3 transition-all ${
              player.isCurrentUser 
                ? 'bg-[#fcd400] hard-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer' 
                : 'bg-white hover:bg-[#ebe8e1]'
            }`}
          >
            <span className="font-display font-black text-[#1c1c18] text-lg w-8 tracking-tighter text-center">
              {player.rank}
            </span>
            <div className="w-11 h-11 rounded-full border-2 border-[#1c1c18] overflow-hidden flex-shrink-0 bg-white">
              <img alt={player.name} className="w-full h-full object-cover" src={player.avatar} />
            </div>
            <div className="flex-grow min-w-0 pr-1">
              <p className="font-sans font-extrabold text-xs md:text-sm text-[#1c1c18] truncate">
                {player.name}
              </p>
              <p className="font-sans text-[10px] text-[#5b403e] font-bold">
                {player.diamonds.toLocaleString()} Diamonds
              </p>
            </div>
            
            {player.isCurrentUser ? (
              <div className="bg-[#b71422] text-white px-2.5 py-1 rounded-full font-sans font-bold text-[9px] border border-[#1c1c18] uppercase">
                Me
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border border-[#1c1c18] flex items-center justify-center bg-[#f1eee7]">
                <span className="material-symbols-outlined text-xs">keyboard_arrow_right</span>
              </div>
            )}
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="text-center py-10 font-sans text-xs text-[#5c5c5c] font-bold">
            No geniuses match "{searchQuery}"! Let's get typing beats instead.
          </div>
        )}
      </div>
    </div>
  );
}
