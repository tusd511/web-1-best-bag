from argparse import ArgumentParser as P
from csv import DictWriter as D
import json as j
import random as r
from typing import Callable
import datetime as d
from faker import Faker as F
from unidecode import unidecode as u

f = F(locale="vi_VN", use_weighting=False)
tz = d.timezone(d.timedelta(hours=7))


def save_to_csv(data: list[dict], filename: str):
    with open(filename, "w", encoding="utf-8", newline="") as o:
        w = D(o, fieldnames=data[0].keys())
        w.writeheader()
        w.writerows(data)


def save_to_json(data: list[dict], filename: str):
    with open(filename, "w", encoding="utf-8", newline="") as o:
        j.dump(data, o)


def read_from_json(filename: str):
    with open(filename, "r", encoding="utf-8") as f:
        return j.load(f)


def create_fake(dataname: str, gen_func: Callable[[int], list[dict]], count: int):
    data = gen_func(count)
    save_to_csv(data, f"{dataname}.csv")
    save_to_json(data, f"{dataname}.json")


def generate_fake_users(n) -> list[dict]:
    return [
        {
            "id": f.uuid4(),
            "name": (name := f.name()),
            "email": f.free_email().replace(
                "@", f".{(sname := u("".join(name.split()[-2:])).lower())}@"
            ),
            "password": f"{sname}-{f.password(
                length=8,
                special_chars=True,
                digits=True,
                upper_case=True,
                lower_case=True,
            )}",
            "ngay-tao": f.date_time_this_year(before_now=True, tzinfo=tz).isoformat(),
            "disabled": f.boolean(chance_of_getting_true=5),
        }
        for _ in range(n)
    ]


def generate_fake_receipt(n) -> list[dict]:
    n_sp_use = 100
    n_nd_use = 80
    sp_per_receipt = 5
    sp_n_per_detail = 5
    sps: list[str] = list(
        map(
            lambda sp: sp["web-scraper-order"],
            r.sample(read_from_json("san-pham.json"), n_sp_use),
        )
    )
    nds: list[str] = list(
        map(lambda nd: nd["id"], r.sample(read_from_json("nguoi-dung.json"), n_nd_use))
    )
    return [
        {
            "id": f.uuid4(),
            "nguoi-dung": r.choice(nds),
            "ngay-tao": f.date_time_this_year(before_now=True, tzinfo=tz).isoformat(),
            "chi-tiet": [
                {"san-pham": sp, "so-luong": r.randint(1, sp_n_per_detail)}
                for sp in r.sample(sps, k=r.randint(1, sp_per_receipt))
            ],
            "xu-ly": x,
        }
        for x in r.choices(
            ["chua", "dang", "huy", "roi"], cum_weights=[10, 25, 60, 1000], k=n
        )
    ]


def generate_fake_cart(n) -> list[dict]:
    n_sp_use = 300
    sp_per_order = 3
    sp_n_per_detail = 2
    sps: list[str] = list(
        map(
            lambda sp: sp["web-scraper-order"],
            r.sample(read_from_json("san-pham.json"), n_sp_use),
        )
    )
    return [
        {
            "nguoi-dung": x,
            "chi-tiet": [
                {"san-pham": sp, "so-luong": r.randint(1, sp_n_per_detail)}
                for sp in r.sample(sps, k=r.randint(1, sp_per_order))
            ],
        }
        for x in map(
            lambda nd: nd["id"],
            r.sample(
                list(
                    filter(
                        lambda x: not x["disabled"], read_from_json("nguoi-dung.json")
                    )
                ),
                n,
            ),
        )
    ]


data_types = {
    "nguoi-dung": generate_fake_users,
    "hoa-don": generate_fake_receipt,
    "gio-hang": generate_fake_cart,
}

if __name__ == "__main__":
    p = P(description="Generate fake data")
    p.add_argument(
        "datatype", choices=data_types.keys(), help="Type of data to generate"
    )
    p.add_argument("count", type=int, help="Number of records to generate")
    a = p.parse_args()
    create_fake(a.datatype, data_types[a.datatype], a.count)
