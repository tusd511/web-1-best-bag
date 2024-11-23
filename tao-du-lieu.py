from re import L
from typing import Callable
from faker import Faker as F
from csv import DictWriter as D
from unidecode import unidecode as u
from argparse import ArgumentParser as P
from json import dump as j


def save_to_csv(data: list[dict], filename: str):
    with open(filename, "w", encoding="utf-8", newline="") as f:
        w = D(f, fieldnames=data[0].keys())
        w.writeheader()
        w.writerows(data)


def save_to_json(data: list[dict], filename: str):
    with open(filename, "w", encoding="utf-8", newline="") as f:
        j(data, f)


def create_fake(dataname: str, gen_func: Callable[[int], list[dict]], count: int):
    data = gen_func(count)
    save_to_csv(data, f"{dataname}.csv")
    save_to_json(data, f"{dataname}.json")


def generate_fake_users(n) -> list[dict]:
    f = F(locale="vi_VN", use_weighting=False)
    return [
        {
            "id": f.uuid4(),
            "full_name": (name := f.name()),
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
            "disabled": f.boolean(chance_of_getting_true=10),
        }
        for _ in range(n)
    ]


def generate_fake_receipt(n) -> list[dict]:
    pass


data_types = {"nguoi-dung": generate_fake_users, "hoa-don": generate_fake_receipt}

if __name__ == "__main__":
    p = P(description="Generate fake data")
    p.add_argument(
        "datatype", choices=data_types.keys(), help="Type of data to generate"
    )
    p.add_argument("count", type=int, help="Number of records to generate")
    a = p.parse_args()
    create_fake(a.datatype, data_types[a.datatype], a.count)
